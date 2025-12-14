import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { ComplaintStatus, ComplaintType } from "@prisma/client";
import { ComplaintHistoryPayload } from "../validators/select-complaints-history.validator";
import { JsonValue } from "@prisma/client/runtime/library";

export class ComplaintHistoryEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  version: number;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String, required: false })
  problemDescription: string | null;

  @ApiProperty({ type: String, required: false })
  processingByEmployeeId: string | null;

  @ApiProperty({ type: String, required: false })
  employeeNotes: string | null;

  @ApiProperty({ type: String, required: false })
  extraInfo: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: String, enum: ComplaintStatus })
  status: ComplaintStatus;

  @ApiProperty({ type: String, enum: ComplaintType })
  type: ComplaintType;

  @ApiProperty({
    type: Object,
  })
  updatedFields: JsonValue;

  constructor(obj: ComplaintHistoryPayload) {
    this.id = obj.id;
    this.version = obj.version;
    this.address = obj.address;
    this.problemDescription = obj.problemDescription;
    this.employeeNotes = obj.employeeNotes;
    this.extraInfo = obj.extraInfo;
    this.status = obj.status;
    this.type = obj.type;
    this.updatedFields = obj.updatedFields;
    this.processingByEmployeeId = obj.processingByEmployeeId;
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: ComplaintHistoryPayload | ComplaintHistoryPayload[],
  ): ComplaintHistoryEntity | ComplaintHistoryEntity[] {
    if (Array.isArray(payload)) {
      return payload.map(
        (payloadItem) => new ComplaintHistoryEntity(payloadItem),
      );
    }
    return new ComplaintHistoryEntity(payload);
  }
}

export class ComplaintHistoryEntities extends PaginationMixin(
  ComplaintHistoryEntity,
) {}
