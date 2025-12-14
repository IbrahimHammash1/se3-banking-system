import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { selectActorValidator } from "../../actors/validators/select-actor.validator";

@Injectable()
export class AuthenticationRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  async findActorByEmail(email: string) {
    return this._globalFacadeService.prismaService.actor.findUnique({
      where: { email },
    });
  }

  async findViewActorByEmail(email: string) {
    return this._globalFacadeService.prismaService.actor.findUnique({
      where: { email },
      select: selectActorValidator(),
    });
  }
}
