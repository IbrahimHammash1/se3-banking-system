import { ApiProperty } from "@nestjs/swagger";

class ValidationErrorEntity {
  @ApiProperty({ type: String })
  property: string;
  @ApiProperty({ type: String, isArray: true })
  errors: string[];
}

export class ValidationErrorResponseEntity {
  @ApiProperty({ type: ValidationErrorEntity, isArray: true })
  message: ValidationErrorEntity;
  @ApiProperty({ type: String })
  error: string;
  @ApiProperty({ type: Number })
  statusCodes: number;
}
