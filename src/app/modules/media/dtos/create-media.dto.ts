import { ApiProperty } from "@nestjs/swagger";
import { Filetype } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString, IsEnum } from "class-validator";

export class CreateMediaDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  size: number;

  @ApiProperty({ enum: Filetype, type: String })
  @IsEnum(Filetype)
  type: Filetype;
}
