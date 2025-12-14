import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { DevicePayload } from "../validator/select-device.validator";
import { DevicePlatform, Language } from "@prisma/client";

export class DeviceEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  fcmToken: string;

  @ApiProperty({ type: String, enum: DevicePlatform })
  platform: DevicePlatform;

  @ApiProperty({ type: String, enum: Language })
  language: Language;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: DevicePayload) {
    this.id = obj.id;
    this.fcmToken = obj.fcmToken;
    this.language = obj.language;
    this.platform = obj.platform;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: DevicePayload | DevicePayload[],
  ): DeviceEntity | DeviceEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new DeviceEntity(payloadItem));
    }
    return new DeviceEntity(payload);
  }
}

export class DeviceEntities extends PaginationMixin(DeviceEntity) {}
