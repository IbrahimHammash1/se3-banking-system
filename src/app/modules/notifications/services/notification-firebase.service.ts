import { Injectable, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Inject } from "@nestjs/common";
import { DevicesService } from "../../devices/services/devices.service";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { CreateNotificationDto } from "../dtos/create-notification.dto";
import { NotificationRepository } from "../repositories/notification.repository";
import { I18nPath } from "src/generated/i18n.generated";
import { OnEvent } from "@nestjs/event-emitter";
import { EVENTS_EMITTER } from "@common/config/event-emitter.constant";
import { Propagation, Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class NotificationFirebaseService {
  constructor(
    @Inject("FIREBASE_SERVICE") private readonly firebaseService: admin.app.App,
    private readonly _devicesService: DevicesService,
    private readonly _globalFacadeService: GlobalFacadeService,
    private readonly _notificationRepository: NotificationRepository,
  ) {}
  async sendToDevice(
    token: string,
    createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const title = await this._globalFacadeService.translate(
        `notifications.${createNotificationDto.purpose}.title` as I18nPath,
        this._globalFacadeService.language,
        createNotificationDto.payload as Record<string, any>,
      );
      const body = await this._globalFacadeService.translate(
        `notifications.${createNotificationDto.purpose}.body` as I18nPath,
        this._globalFacadeService.language,
        createNotificationDto.payload as Record<string, any>,
      );
      await this.firebaseService.messaging().send({
        token,
        notification: {
          title: title,
          body: body,
        },
        data: createNotificationDto.payload as Record<string, any>,
      });
    } catch (error) {
      Logger.error("Error sending notification:", error);
    }
  }

  @OnEvent(EVENTS_EMITTER.NOTIFICATION_CREATE)
  @Transactional(Propagation.NotSupported)
  async createAndSendNotification(
    createNotificationDto: CreateNotificationDto,
  ) {
    const notification = await this._notificationRepository.create(
      createNotificationDto,
    );
    const deviceTokens = await this._devicesService.getActorFcmTokens(
      createNotificationDto.receiverId,
    );
    if (deviceTokens.length > 0) {
      const promises = deviceTokens.map(async (device) => {
        return this.sendToDevice(device.fcmToken, createNotificationDto);
      });
      await Promise.all(promises);
    }

    return notification;
  }

  //   async sendBulkNotifications(
  //     receiverIds: string[],
  //     message: string,
  //     senderId?: string,
  //     payload?: any,
  //     purpose: string = "SYSTEM",
  //   ) {
  //     const notificationPromises = receiverIds.map((receiverId) =>
  //       this.createAndSendNotification(
  //         receiverId,
  //         message,
  //         senderId,
  //         payload,
  //         purpose,
  //       ),
  //     );

  //     const notifications = await Promise.all(notificationPromises);

  //     return notifications;
  //   }

  //   async sendNotificationToActors(
  //     actorIds: string[],
  //     message: string,
  //     senderId?: string,
  //     payload?: any,
  //     purpose: string = "SYSTEM",
  //   ) {
  //     const notificationResults = await Promise.all(
  //       actorIds.map(async (actorId) => {
  //         const notification = await this.createAndSendNotification(
  //           actorId,
  //           message,
  //           senderId,
  //           payload,
  //           purpose,
  //         );
  //         return notification;
  //       }),
  //     );

  //     return notificationResults;
  //   }
}
