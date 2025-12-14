import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { RegisterCitizenAccountDto } from "../dtos/register-citizen-account.dto";
import { selectCitizenValidator } from "../validator/select-citizen.validator";
@Injectable()
export class CitizenRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  create(registerCitizenAccountDto: RegisterCitizenAccountDto) {
    return this._globalFacadeService.prismaService.actor.create({
      data: registerCitizenAccountDto,
      select: selectCitizenValidator(),
    });
  }
}
