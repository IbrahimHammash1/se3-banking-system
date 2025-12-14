import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { selectNotificationValidator } from "../validator/select-notification.validator";
import { SearchNotificationDTO } from "../dtos/search-notification.dto";
import { calculatePaginationParams } from "@common/utils/pagination/calculate-pagination-params.util";
import { CreateNotificationDto } from "../dtos/create-notification.dto";

@Injectable()
export class NotificationRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}
  async findAll(searchNotificationDTO: SearchNotificationDTO) {
    const { skip, take } = calculatePaginationParams(
      searchNotificationDTO.page,
      searchNotificationDTO.perPage,
    );

    const notifications =
      await this._globalFacadeService.prismaService.notification.findMany({
        skip,
        take,
        where: { receiverId: this._globalFacadeService.actorId },
        select: selectNotificationValidator(),
        orderBy: { createdAt: "desc" },
      });
    const total =
      await this._globalFacadeService.prismaService.notification.count({
        where: { receiverId: this._globalFacadeService.actorId },
      });
    return { notifications, total };
  }

  async countUnseen() {
    return this._globalFacadeService.prismaService.notification.count({
      where: { receiverId: this._globalFacadeService.actorId, isSeen: false },
    });
  }

  async updateSeenNotifications(notificationsIds: string[]) {
    return this._globalFacadeService.prismaService.notification.updateMany({
      where: {
        id: { in: notificationsIds },
      },
      data: {
        isSeen: true,
      },
    });
  }

  async updateReadNotification(notificationId: string) {
    return this._globalFacadeService.prismaService.notification.update({
      where: {
        id: notificationId,
        receiverId: this._globalFacadeService.actorId,
      },
      data: {
        isRead: true,
      },
      select: selectNotificationValidator(),
    });
  }

  async create(createNotificationDto: CreateNotificationDto) {
    return this._globalFacadeService.prismaService.notification.create({
      data: createNotificationDto,
      select: selectNotificationValidator(),
    });
  }
}
