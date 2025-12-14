import { ApiProperty } from "@nestjs/swagger";
import { ComplaintType } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateComplaintDto {
  @ApiProperty({ type: String, enum: ComplaintType })
  @IsEnum(ComplaintType)
  type: ComplaintType;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  governmentAgencyId!: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  complaintFiles!: string[];

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  problemDescription?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  extraInfo?: string;
}
