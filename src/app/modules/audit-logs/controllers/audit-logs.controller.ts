import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuditLogsService } from "../services/audit-logs.service";
import { Roles } from "../../authentication/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { AuditLogEntities, AuditLogEntity } from "../entities/audit-log.entity";
import { SearchAuditLogsDTO } from "../dtos/search-audit-logs.dto";
import { checkIfIdExist } from "@common/mixins/check-if-id-exist.pipe";

@Controller({
  path: "audit-logs",
})
@Roles(Role.ADMIN)
@ApiTags(SWAGGER_TAGS.AUDIT_LOGS)
export class AuditLogsController {
  constructor(private readonly _auditLogsService: AuditLogsService) {}

  @ApiResponse({ type: AuditLogEntities })
  @Get("")
  async findAll(@Query() searchAuditLogsDTO: SearchAuditLogsDTO) {
    const { auditLogs, meta } =
      await this._auditLogsService.findAll(searchAuditLogsDTO);
    return AuditLogEntities.createInstance({
      data: AuditLogEntity.createInstance(auditLogs),
      meta,
    });
  }

  @Get(":auditLogId")
  @ApiResponse({ type: AuditLogEntity })
  async findOne(
    @Param("auditLogId", checkIfIdExist("AuditLog"))
    auditLogId: string,
  ) {
    const auditLog = await this._auditLogsService.findOne(auditLogId);
    return AuditLogEntity.createInstance(auditLog!);
  }
}
