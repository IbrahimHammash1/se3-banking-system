import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsDateString } from "class-validator";

export class DateSearchDto {
  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
