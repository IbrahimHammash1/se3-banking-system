import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { AccountStatus } from "@prisma/client";
import { CreateSessionDto } from "../dtos/create-session.dto";
import { selectSessionValidator } from "../validators/select-session.validator";
import { selectCitizenValidator } from "../../citizen/validator/select-citizen.validator";
import { ReCreateSessionDto } from "../dtos/recreate-session.dto";
@Injectable()
export class SessionRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  create(createSessionDto: CreateSessionDto) {
    return this._globalFacadeService.prismaService.session.create({
      data: createSessionDto,
      select: selectSessionValidator(),
    });
  }

  findOne(sessionId: string) {
    return this._globalFacadeService.prismaService.session.findUnique({
      where: { id: sessionId },
    });
  }

  decreaseRetries(sessionId: string) {
    return this._globalFacadeService.prismaService.session.update({
      where: { id: sessionId },
      data: { retriesCount: { decrement: 1 } },
    });
  }

  async activateAccountBySessionId(sessionId: string) {
    return this._globalFacadeService.prismaService.session.update({
      where: { id: sessionId },
      data: {
        retriesCount: 0,
        actor: { update: { data: { accountStatus: AccountStatus.ACTIVE } } },
      },
    });
  }

  async getUserAccount(actorId: string) {
    return this._globalFacadeService.prismaService.actor.findUnique({
      where: { id: actorId },
      select: selectCitizenValidator(),
    });
  }

  async findActorByEmailAndPhone(reCreateSessionDto: ReCreateSessionDto) {
    return this._globalFacadeService.prismaService.actor.findUnique({
      where: {
        email: reCreateSessionDto.email,
        phone: reCreateSessionDto.phone,
      },
    });
  }
}
