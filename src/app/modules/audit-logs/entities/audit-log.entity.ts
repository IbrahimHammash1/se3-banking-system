import { ApiProperty } from "@nestjs/swagger";
import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { AuditLogPayload } from "../../audit-logs/validator/select-audit-log.validator";

export class AuditLogEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  method: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String, required: false })
  ip: string | null;

  @ApiProperty({ type: String, required: false })
  platform: string | null;

  @ApiProperty({ type: String, required: false })
  duration: string | null;

  @ApiProperty({ type: String, required: false })
  userAgent: string | null;

  @ApiProperty({ type: String, required: false })
  errorMessage: string | null;

  @ApiProperty({ type: String, required: false })
  errorStack: string | null;

  @ApiProperty({ type: String, required: false })
  actorId: string | null;

  @ApiProperty({ type: String, required: false })
  actorName: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: AuditLogPayload) {
    this.id = obj.id;
    this.method = obj.method;
    this.url = obj.url;
    this.statusCode = obj.statusCode;
    this.ip = obj.ip;
    this.platform = obj.platform;
    this.userAgent = obj.userAgent;
    this.errorMessage = obj.errorMessage;
    this.errorStack = obj.errorStack;
    this.duration = obj.duration;
    this.actorName = obj.userActor?.fullName ?? null;
    this.actorId = obj.userActor?.id ?? null;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: AuditLogPayload | AuditLogPayload[],
  ): AuditLogEntity | AuditLogEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new AuditLogEntity(payloadItem));
    }
    return new AuditLogEntity(payload);
  }
}

export class AuditLogEntities extends PaginationMixin(AuditLogEntity) {}
