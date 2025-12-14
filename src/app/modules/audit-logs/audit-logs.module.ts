import { Module } from "@nestjs/common";
import { AuditLogsController } from "./controllers/audit-logs.controller";
import { AuditLogsService } from "./services/audit-logs.service";
import { AuditLogsRepository } from "./repositories/audit-logs.repository";
import { AuditLogInterceptor } from "./interceptors/audit-log.interceptor";

@Module({
  imports: [],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, AuditLogsRepository, AuditLogInterceptor],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
