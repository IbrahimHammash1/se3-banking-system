import { envConfig } from "@common/config/env-config";
import { Module } from "@nestjs/common";
import * as admin from "firebase-admin";
import { NotificationRepository } from "./repositories/notification.repository";
import { NotificationService } from "./services/notification.service";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationFirebaseService } from "./services/notification-firebase.service";
import { DevicesModule } from "../devices/devices.module";

@Module({
  imports: [DevicesModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: "FIREBASE_SERVICE",
      useFactory: () => {
        const app = !admin.apps.length
          ? admin.initializeApp({
              credential: admin.credential.cert({
                projectId: envConfig.FIREBASE_PROJECT_ID,
                clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
                privateKey: envConfig.FIREBASE_PRIVATE_KEY,
              }),
            })
          : admin.apps[0];
        return app;
      },
    },
    NotificationRepository,
    NotificationService,
    NotificationFirebaseService,
  ],
  exports: [NotificationFirebaseService, "FIREBASE_SERVICE"],
})
export class NotificationsModule {}
