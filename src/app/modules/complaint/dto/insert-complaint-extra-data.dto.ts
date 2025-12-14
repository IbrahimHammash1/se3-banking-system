import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class InsertComplaintExtraDataDto {
  @ApiProperty({ type: String })
  @IsString({})
  @IsNotEmpty()
  value!: string;
}
