import { ApiProperty } from "@nestjs/swagger";
import { ComplaintStatus } from "@prisma/client";

type ComplaintsStatusChangedNotificationPayload = {
  id: string;
  status: ComplaintStatus;
};

export class ComplaintsStatusChangedNotificationEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, enum: ComplaintStatus })
  status: ComplaintStatus;

  constructor(obj: ComplaintsStatusChangedNotificationPayload) {
    this.id = obj.id;
    this.status = obj.status;
  }
}
