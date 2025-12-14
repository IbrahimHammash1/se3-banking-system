import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    type: String,
    example: "user@gmail.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: "12345678" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  password!: string;
}
