import { ApiProperty } from "@nestjs/swagger";

export class GlobalResponseEntity {
  @ApiProperty({ type: Object })
  data: object;
  @ApiProperty({ type: String })
  message: string;
  @ApiProperty({ type: Number })
  statusCodes: number;
}
