import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { CreateDeviceDto } from "../dtos/create-device.dto";
import { selectDeviceValidator } from "../validator/select-device.validator";

@Injectable()
export class DevicesRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  async upsert(createDeviceDto: CreateDeviceDto) {
    return this._globalFacadeService.prismaService.device.upsert({
      where: {
        fcmToken: createDeviceDto.fcmToken,
      },
      create: {
        ...createDeviceDto,
        actorId: this._globalFacadeService.actorId,
      },
      update: {
        platform: createDeviceDto.platform,
        language: createDeviceDto.language,
      },
      select: selectDeviceValidator(),
    });
  }

  async getActorFcmTokens(actorId: string) {
    return this._globalFacadeService.prismaService.device.findMany({
      where: {
        actorId,
      },
      select: { fcmToken: true },
    });
  }
}
