import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseEntity {
  @ApiProperty({ type: String })
  message: string;
  @ApiProperty({ type: String })
  error: string;
  @ApiProperty({ type: Number })
  statusCodes: number;
}
