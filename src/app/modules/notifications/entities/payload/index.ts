import {
  ReferenceObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { ComplaintsModificationRequestNotificationEntity } from "./complaints-modification-request.notification.entity";
import { getSchemaPath } from "@nestjs/swagger";
import { ComplaintsStatusChangedNotificationEntity } from "./complaints-status-changed.notification.entity";

export const SwaggerNotificationPayloadExtraModels = [
  ComplaintsModificationRequestNotificationEntity,
  ComplaintsStatusChangedNotificationEntity,
];
export const NotificationPayloadOneOf: (SchemaObject | ReferenceObject)[] = [
  { $ref: getSchemaPath(ComplaintsModificationRequestNotificationEntity) },
  { $ref: getSchemaPath(ComplaintsStatusChangedNotificationEntity) },
];
