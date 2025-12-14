import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateComplaintDto } from "./create-complaint.dto";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ComplaintStatus } from "@prisma/client";

export class UpdateComplaintDto extends PartialType(CreateComplaintDto) {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  employeeNotes?: string;

  @ApiProperty({ type: String, enum: ComplaintStatus })
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;
}
