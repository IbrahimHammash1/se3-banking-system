import { ApiProperty } from "@nestjs/swagger";

export class CountUnseenNotificationEntity {
  @ApiProperty({ type: Number })
  count: number;
}
