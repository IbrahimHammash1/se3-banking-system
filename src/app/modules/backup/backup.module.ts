import { Module } from "@nestjs/common";
import { DatabaseCronjobBackupService } from "./services/backup-cronjob.service";
import { DatabaseCronjobBackupController } from "./controllers/backup-cronjob.controller";
@Module({
  imports: [],
  controllers: [DatabaseCronjobBackupController],
  providers: [DatabaseCronjobBackupService],
  exports: [],
})
export class BackupModule {}
