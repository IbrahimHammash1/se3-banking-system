import { ApiProperty } from "@nestjs/swagger";
import { envConfig } from "@common/config/env-config";
import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { GovernmentAgencyPayload } from "../validators/select-government-agency.validator";

export class GovernmentAgencyEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  sector: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: GovernmentAgencyPayload) {
    this.id = obj.id;
    this.name = obj.name;
    this.sector = obj.sector;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: GovernmentAgencyPayload | GovernmentAgencyPayload[],
  ): GovernmentAgencyEntity | GovernmentAgencyEntity[] {
    if (Array.isArray(payload)) {
      return payload.map(
        (payloadItem) => new GovernmentAgencyEntity(payloadItem),
      );
    }
    return new GovernmentAgencyEntity(payload);
  }

  private constructLocalFileUrl(fileName: string) {
    return new URL(fileName, envConfig.BASE_URL);
  }
}

export class GovernmentAgencyEntities extends PaginationMixin(
  GovernmentAgencyEntity,
) {}
