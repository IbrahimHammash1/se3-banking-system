import { PaginationMetaData } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";

export class GlobalPaginatedResponseEntity {
  @ApiProperty({ type: Object, isArray: true })
  data: object;
  @ApiProperty({ type: PaginationMetaData })
  meta: PaginationMetaData;
  @ApiProperty({ type: String })
  message: string;
  @ApiProperty({ type: Number })
  statusCodes: number;
}
