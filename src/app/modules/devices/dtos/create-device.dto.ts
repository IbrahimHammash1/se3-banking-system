import { ApiProperty } from "@nestjs/swagger";
import { DevicePlatform, Language } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDeviceDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  fcmToken!: string;

  @ApiProperty({
    type: String,
    enum: DevicePlatform,
    example: DevicePlatform.MOBILE,
  })
  @IsEnum(DevicePlatform)
  @IsOptional()
  platform: DevicePlatform;

  @ApiProperty({ type: String, enum: Language, example: Language.en })
  @IsEnum(Language)
  @IsOptional()
  language: Language;
}
