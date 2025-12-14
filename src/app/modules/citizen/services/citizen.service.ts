import { CitizenRepository } from "./../repositories/citizen.repository";
import { Injectable } from "@nestjs/common";
import { RegisterCitizenAccountDto } from "../dtos/register-citizen-account.dto";
import { Propagation, Transactional } from "@nestjs-cls/transactional";
import { PasswordUtils } from "@common/utils/hashing/password.util";
import { SessionService } from "../../authentication/services/session.service";
import { SessionType } from "@prisma/client";
import { OTP_METHOD } from "../../authentication/dtos/create-session.dto";

@Injectable()
export class CitizenService {
  constructor(
    private readonly _citizenRepository: CitizenRepository,
    private readonly _sessionService: SessionService,
  ) {}

  @Transactional(Propagation.Required)
  async register(registerCitizenAccountDto: RegisterCitizenAccountDto) {
    const createdActor = await this._citizenRepository.create({
      ...registerCitizenAccountDto,
      password: await PasswordUtils.hashPassword(
        registerCitizenAccountDto.password,
      ),
    });
    const session = await this._sessionService.create(
      { type: SessionType.SIGN_UP, actorId: createdActor.id },
      OTP_METHOD.EMAIL,
      createdActor.email,
      createdActor.phone,
    );
    return session;
  }
}
