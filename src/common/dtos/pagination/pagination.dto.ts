import { IsOptional, IsPositive, Min, Max, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class PaginationDTO {
  @ApiProperty({ type: Number, required: false, default: 1 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsPositive()
  @Min(1)
  @IsNumber()
  page: number = 1;

  @ApiProperty({ type: Number, required: false, default: 10 })
  @Transform(({ value }) => Number(value))
  @IsPositive()
  @Min(1)
  @Max(100)
  @IsNumber()
  perPage: number = 10;
}
