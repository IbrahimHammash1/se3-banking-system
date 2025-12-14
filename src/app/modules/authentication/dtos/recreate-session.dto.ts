import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone } from "class-validator";

export class ReCreateSessionDto {
  @ApiProperty({
    type: String,
    example: "user@gmail.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: "0953464571" })
  @IsMobilePhone("ar-SY")
  phone!: string;
}
