import { ApiProperty } from "@nestjs/swagger";

type ComplaintsModificationRequestNotificationPayload = {
  id: string;
};

export class ComplaintsModificationRequestNotificationEntity {
  @ApiProperty({ type: String })
  id: string;

  constructor(obj: ComplaintsModificationRequestNotificationPayload) {
    this.id = obj.id;
  }
}
