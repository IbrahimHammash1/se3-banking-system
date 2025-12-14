import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { SessionPayload } from "../validators/select-session.validator";
import { SessionType } from "@prisma/client";

export class SessionEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  retriesCount: number;

  @ApiProperty({ type: String, enum: SessionType })
  type: SessionType;

  @ApiProperty({ type: String })
  actorId: string;

  @ApiProperty({ type: Date, required: false })
  otpExpireAt?: Date | null;

  @ApiProperty({ type: Date })
  expireAt: Date;

  constructor(obj: SessionPayload) {
    this.id = obj.id;
    this.actorId = obj.actorId;
    this.expireAt = obj.expireAt;
    this.otpExpireAt = obj.otpExpireAt;
    this.retriesCount = obj.retriesCount;
  }

  static createInstance(payload: SessionPayload): SessionEntity {
    return new SessionEntity(payload);
  }
}

export class SessionEntities extends PaginationMixin(SessionEntity) {}
