import { ApiProperty } from "@nestjs/swagger";
import { NotificationPurpose, NotificationType } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
  @ApiProperty({ type: String })
  payload!: InputJsonValue;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  receiverId!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  senderId?: string;

  @ApiProperty({ type: String, enum: NotificationType })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiProperty({ type: String, enum: NotificationPurpose })
  @IsEnum(NotificationPurpose)
  purpose: NotificationPurpose;
}
