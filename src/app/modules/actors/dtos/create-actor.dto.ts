import { ApiProperty } from "@nestjs/swagger";
import { AccountStatus, Role } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateActorDto {
  @ApiProperty({ type: String, example: "customUserName1234" })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  fullName!: string;

  @ApiProperty({ type: String, example: "1234567891" })
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @IsOptional()
  nationalId?: string;

  @ApiProperty({ type: String, example: "12345678" })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password!: string;

  @ApiProperty({
    type: String,
    example: "user@gmail.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: "0953464571" })
  @IsMobilePhone("ar-SY")
  phone!: string;

  @ApiProperty({ type: String, enum: AccountStatus })
  @IsEnum(AccountStatus)
  accountStatus: AccountStatus;

  @ApiProperty({ type: String, enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ type: String, example: "1234567891" })
  @IsString()
  @IsOptional()
  imageId?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  governmentAgencyId?: string;
}
