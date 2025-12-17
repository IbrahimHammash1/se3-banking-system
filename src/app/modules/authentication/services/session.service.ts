import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { SessionRepository } from "../repositories/session.repository";
import { CreateSessionDto, OTP_METHOD } from "../dtos/create-session.dto";
import { generateExpireDateUtil } from "@common/utils/dates/generate-expire-date.util";
import { envConfig } from "@common/config/env-config";
import { AccountStatus, SessionType } from "@prisma/client";
import { Propagation, Transactional } from "@nestjs-cls/transactional";
import { ReCreateSessionDto } from "../dtos/recreate-session.dto";
@Injectable()
export class SessionService {
  constructor(private readonly _sessionRepository: SessionRepository) {}

  async create(
    createSessionDto: Partial<CreateSessionDto>,
    otpMethod: OTP_METHOD,
    email?: string,
    phone?: string,
  ) {
    const otp =
      otpMethod !== OTP_METHOD.NONE
        ? this.createOtpAndSend(otpMethod, email, phone)
        : {};
    return this._sessionRepository.create({
      ...createSessionDto,
      ...otp,
      expireAt: generateExpireDateUtil(48),
    } as CreateSessionDto);
  }

  createOtpAndSend(otpMethod: OTP_METHOD, email?: string, phone?: string) {
    const otpCode = this.generateRandomNumber();
    const otpExpireAt = generateExpireDateUtil(6);
    switch (otpMethod) {
      case OTP_METHOD.EMAIL:
        this.sendOtpOverEmail(otpCode, email!);
        break;
      case OTP_METHOD.SMS:
        this.sendOtpOverSms(otpCode, phone!);
        break;
      default:
        break;
    }
    return { otpCode, otpExpireAt };
  }

  sendOtpOverEmail(otpCode: string, email: string) {
    Logger.log(`Sending ${otpCode} to ${email}`);
  }

  sendOtpOverSms(otpCode: string, phone: string) {
    Logger.log(`Sending ${otpCode} to ${phone}`);
  }

  private generateRandomNumber(): string {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
  }

  async verifySession(sessionId: string) {
    const session = await this._sessionRepository.findOne(sessionId);
    if (!session) {
      throw new NotFoundException("Session not found!");
    }
    if (session.retriesCount === 0) {
      throw new ForbiddenException(
        "You have reached maximum retries on this session",
      );
    }
    const currentDate = new Date();
    if (
      currentDate >= session.expireAt ||
      (session.otpExpireAt && currentDate >= session.otpExpireAt)
    ) {
      throw new ForbiddenException("Your session has expired");
    }
    return session;
  }

  @Transactional(Propagation.Required)
  async verifyOtp(sessionId: string, otpCode: string) {
    const session = await this.verifySession(sessionId);
    if (
      otpCode !== session.otpCode &&
      envConfig.IS_DEV_ENV() &&
      otpCode !== envConfig.OTP_MASTER_CODE
    ) {
      await this.decreaseOtpRetries(sessionId);
      throw new ForbiddenException();
    }
    switch (session.type) {
      case SessionType.SIGN_UP:
        await this.activateAccountBySessionId(sessionId);
        break;
      case SessionType.EMAIL:
        break;
      default:
        break;
    }
    // TODO:return actor profile , generate tokens ...
    const actorAccount = await this._sessionRepository.getUserAccount(
      session.actorId,
    );
    // return CitizenEntity.createInstance(actorAccount!);
  }

  @Transactional(Propagation.NotSupported)
  async decreaseOtpRetries(sessionId: string) {
    return this._sessionRepository.decreaseRetries(sessionId);
  }

  async activateAccountBySessionId(sessionId: string) {
    return this._sessionRepository.activateAccountBySessionId(sessionId);
  }

  @Transactional(Propagation.Required)
  async createSessionByActorEmailAndPhone(
    reCreateSessionDto: ReCreateSessionDto,
  ) {
    const actor =
      await this._sessionRepository.findActorByEmailAndPhone(
        reCreateSessionDto,
      );
    if (!actor || (actor && actor.accountStatus === AccountStatus.BLOCKED)) {
      throw new ForbiddenException();
    }
    if (actor.accountStatus === AccountStatus.ACTIVE) {
      throw new UnprocessableEntityException(
        "Your account is already activated",
      );
    }
    const session = await this.create(
      { type: SessionType.SIGN_UP, actorId: actor.id },
      OTP_METHOD.EMAIL,
      reCreateSessionDto.email,
      reCreateSessionDto.phone,
    );
    return session;
  }
}
