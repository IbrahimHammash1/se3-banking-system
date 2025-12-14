import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { CitizenPayload } from "../validator/select-citizen.validator";
import { MediaEntity } from "../../media/entity/media.entity";

export class CitizenEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  fullName: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String, required: false })
  nationalId?: string | null;

  @ApiProperty({ type: MediaEntity, required: false })
  image: MediaEntity | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: CitizenPayload) {
    this.id = obj.id;
    this.fullName = obj.fullName;
    this.email = obj.email;
    this.phone = obj.phone;
    this.nationalId = obj.nationalId;
    this.image = obj.image
      ? (MediaEntity.createInstance(obj.image) as MediaEntity)
      : null;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: CitizenPayload | CitizenPayload[],
  ): CitizenEntity | CitizenEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new CitizenEntity(payloadItem));
    }
    return new CitizenEntity(payload);
  }
}

export class CitizenEntities extends PaginationMixin(CitizenEntity) {}
