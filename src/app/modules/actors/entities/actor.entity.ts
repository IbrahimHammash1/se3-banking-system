import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { ActorPayload } from "../validators/select-actor.validator";
import { Role, AccountStatus } from "@prisma/client";

export class ActorEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  fullName: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String, enum: Role })
  role: Role;

  @ApiProperty({ type: String, enum: AccountStatus })
  accountStatus: AccountStatus;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: ActorPayload) {
    this.id = obj.id;
    this.fullName = obj.fullName;
    this.email = obj.email;
    this.phone = obj.phone;
    this.role = obj.role;
    this.accountStatus = obj.accountStatus;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: ActorPayload | ActorPayload[],
  ): ActorEntity | ActorEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new ActorEntity(payloadItem));
    }
    return new ActorEntity(payload);
  }
}

export class ActorEntities extends PaginationMixin(ActorEntity) {}
