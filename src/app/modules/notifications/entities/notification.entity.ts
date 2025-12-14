import { PaginationMixin } from "@common/mixins/pagination.mixin";
import { ApiProperty } from "@nestjs/swagger";
import { NotificationPayload } from "../validator/select-notification.validator";
import {
  NotificationPurpose,
  NotificationType,
  Language,
} from "@prisma/client";
import { I18nPath } from "src/generated/i18n.generated";
import { I18nContext } from "nestjs-i18n";
import { JsonValue } from "@prisma/client/runtime/library";
import { NotificationPayloadOneOf } from "./payload";

export class NotificationEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  body: string;

  @ApiProperty({ type: Boolean })
  isSeen: boolean;

  @ApiProperty({ type: Boolean })
  isRead: boolean;

  @ApiProperty({ type: String, enum: NotificationPurpose })
  purpose: NotificationPurpose;

  @ApiProperty({
    oneOf: NotificationPayloadOneOf,
  })
  payload: JsonValue;

  @ApiProperty({ type: String, enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(obj: NotificationPayload, language: Language = "en") {
    this.id = obj.id;
    this.isSeen = obj.isSeen;
    this.isRead = obj.isRead;
    this.purpose = obj.purpose;
    this.payload = obj.payload;
    this.type = obj.type;
    this.createdAt = obj.createdAt;
    this.title = this.getDefaultNotificationTitle(
      this.purpose,
      language,
      obj.payload as Record<string, any>,
    );

    this.body = this.getDefaultNotificationBody(
      this.purpose,
      language,
      obj.payload as Record<string, any>,
    );
  }

  static createInstance(
    payload: NotificationPayload | NotificationPayload[],
    language: Language = "en",
  ): NotificationEntity | NotificationEntity[] {
    if (Array.isArray(payload)) {
      return payload.map(
        (payloadItem) => new NotificationEntity(payloadItem, language),
      );
    }
    return new NotificationEntity(payload, language);
  }

  private translate<T extends I18nPath>(
    key: T,
    lang?: Language,
    args?: Record<string, any>,
  ): string {
    return I18nContext.current()!.service.translate(key, {
      lang: lang ?? "en",
      args,
    });
  }

  private getDefaultNotificationTitle(
    purpose: NotificationPurpose,
    lang?: Language,
    args?: Record<string, any>,
  ) {
    return this.translate(
      `notifications.${purpose}.title` as I18nPath,
      lang,
      args,
    );
  }

  private getDefaultNotificationBody(
    purpose: NotificationPurpose,
    lang?: Language,
    args?: Record<string, any>,
  ) {
    return this.translate(
      `notifications.${purpose}.body` as I18nPath,
      lang,
      args,
    );
  }
}

export class NotificationEntities extends PaginationMixin(NotificationEntity) {}
