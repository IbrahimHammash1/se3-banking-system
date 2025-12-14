import { ApiProperty } from "@nestjs/swagger";

type TSystemEntitiesCountPayload = {
  citizensCount: number;
  employeesCount: number;
  adminsCount: number;
  agenciesCount: number;
  newComplaintsCount: number;
  onHoldComplaintsCount: number;
  doneComplaintsCount: number;
  rejectedComplaintsCount: number;
  processingComplaintsCount: number;
};

export class SystemEntitiesCountEntity {
  @ApiProperty({ type: Number })
  citizensCount: number;
  @ApiProperty({ type: Number })
  employeesCount: number;
  @ApiProperty({ type: Number })
  adminsCount: number;
  @ApiProperty({ type: Number })
  agenciesCount: number;
  @ApiProperty({ type: Number })
  newComplaintsCount: number;
  @ApiProperty({ type: Number })
  onHoldComplaintsCount: number;
  @ApiProperty({ type: Number })
  doneComplaintsCount: number;
  @ApiProperty({ type: Number })
  rejectedComplaintsCount: number;
  @ApiProperty({ type: Number })
  processingComplaintsCount: number;
}
