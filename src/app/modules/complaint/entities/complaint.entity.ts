import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { ComplaintPayload } from "../validators/select-complaints.validator";
import { ComplaintStatus, ComplaintType } from "@prisma/client";
import { GovernmentAgencyEntity } from "../../government-agency/entities/government-agency.entity";
import { MediaEntity } from "../../media/entity/media.entity";

export class ComplaintEntity {
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

  @ApiProperty({ type: GovernmentAgencyEntity })
  governmentAgency: GovernmentAgencyEntity;

  @ApiProperty({ type: MediaEntity, isArray: true })
  complaintFiles: MediaEntity[];

  constructor(obj: ComplaintPayload) {
    this.id = obj.id;
    this.version = obj.version;
    this.address = obj.address;
    this.problemDescription = obj.problemDescription;
    this.employeeNotes = obj.employeeNotes;
    this.extraInfo = obj.extraInfo;
    this.status = obj.status;
    this.type = obj.type;
    this.processingByEmployeeId = obj.processingByEmployeeId;
    this.governmentAgency = GovernmentAgencyEntity.createInstance(
      obj.governmentAgency,
    ) as GovernmentAgencyEntity;
    this.complaintFiles =
      obj.complaintFiles.length >= 1
        ? obj.complaintFiles.map((file) => {
            return MediaEntity.createInstance(file.file) as MediaEntity;
          })
        : [];
    this.createdAt = obj.createdAt;
  }

  static createInstance(
    payload: ComplaintPayload | ComplaintPayload[],
  ): ComplaintEntity | ComplaintEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new ComplaintEntity(payloadItem));
    }
    return new ComplaintEntity(payload);
  }
}

export class ComplaintEntities extends PaginationMixin(ComplaintEntity) {}
