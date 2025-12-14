import { Injectable } from "@nestjs/common";
import { SearchNotificationDTO } from "../dtos/search-notification.dto";
import { NotificationRepository } from "../repositories/notification.repository";
import { calculatePaginationMetaData } from "@common/utils/pagination/calculate-pagination-meta-data.util";
@Injectable()
export class NotificationService {
  constructor(
    private readonly _notificationRepository: NotificationRepository,
  ) {}
  async findAll(searchNotificationDTO: SearchNotificationDTO) {
    const { notifications, total } = await this._notificationRepository.findAll(
      searchNotificationDTO,
    );

    const meta = calculatePaginationMetaData(
      total,
      searchNotificationDTO.page,
      searchNotificationDTO.perPage,
    );
    await this._notificationRepository.updateSeenNotifications(
      notifications.map((notification) => notification.id),
    );
    return { notifications, meta };
  }

  async countUnseen() {
    const count = await this._notificationRepository.countUnseen();
    return { count };
  }

  async updateReadNotification(notificationId: string) {
    return this._notificationRepository.updateReadNotification(notificationId);
  }
}
