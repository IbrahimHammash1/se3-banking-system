import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../authentication/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { DatabaseCronjobBackupService } from "../services/backup-cronjob.service";
@Controller({
  path: "backup",
})
@Roles(Role.ADMIN)
@ApiTags(SWAGGER_TAGS.BACKUP)
export class DatabaseCronjobBackupController {
  constructor(
    private readonly _databaseCronjobBackupService: DatabaseCronjobBackupService,
  ) {}

  @Get("trigger-cronjob")
  async triggerBackup() {
    await this._databaseCronjobBackupService.backupCronjob();
    return { message: "Cron job triggered" };
  }
}
