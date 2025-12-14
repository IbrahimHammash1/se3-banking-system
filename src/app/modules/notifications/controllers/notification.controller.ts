import { CountUnseenNotificationEntity } from "./../entities/notification-unseen.entity";
import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationService } from "../services/notification.service";
import {
  NotificationEntities,
  NotificationEntity,
} from "../entities/notification.entity";
import { SearchNotificationDTO } from "../dtos/search-notification.dto";
import { checkIfIdExist } from "@common/mixins/check-if-id-exist.pipe";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
@Controller({
  path: "notifications",
})
@ApiTags(SWAGGER_TAGS.NOTIFICATION)
export class NotificationController {
  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _globalFacadeService: GlobalFacadeService,
  ) {}

  @ApiResponse({ type: NotificationEntities })
  @Get("")
  async findAll(@Query() searchNotificationDTO: SearchNotificationDTO) {
    const { notifications, meta } = await this._notificationService.findAll(
      searchNotificationDTO,
    );
    return NotificationEntities.createInstance({
      data: NotificationEntity.createInstance(
        notifications,
        this._globalFacadeService.language,
      ),
      meta,
    });
  }

  @ApiResponse({ type: CountUnseenNotificationEntity })
  @Get("count-unseen")
  async countUnseen() {
    return this._notificationService.countUnseen();
  }

  @Patch("read/:notificationId")
  @ApiResponse({ type: NotificationEntity })
  async findOne(
    @Param("notificationId", checkIfIdExist("Notification"))
    notificationId: string,
  ) {
    const notification =
      await this._notificationService.updateReadNotification(notificationId);
    return NotificationEntity.createInstance(
      notification,
      this._globalFacadeService.language,
    );
  }
}
