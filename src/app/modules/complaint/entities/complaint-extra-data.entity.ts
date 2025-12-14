import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { ComplaintExtraDataPayload } from "../validators/select-complaints-extra-data.validator";

export class ComplaintExtraDataEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  key: string;

  @ApiProperty({ type: Number })
  version: number;

  @ApiProperty({ type: String, required: false })
  value: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: ComplaintExtraDataPayload) {
    this.id = obj.id;
    this.key = obj.key;
    this.version = obj.version;
    this.value = obj.value;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: ComplaintExtraDataPayload | ComplaintExtraDataPayload[],
  ): ComplaintExtraDataEntity | ComplaintExtraDataEntity[] {
    if (Array.isArray(payload)) {
      return payload.map(
        (payloadItem) => new ComplaintExtraDataEntity(payloadItem),
      );
    }
    return new ComplaintExtraDataEntity(payload);
  }
}

export class ComplaintExtraDataEntities extends PaginationMixin(
  ComplaintExtraDataEntity,
) {}
