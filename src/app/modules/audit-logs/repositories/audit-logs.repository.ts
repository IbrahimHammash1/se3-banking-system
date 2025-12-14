import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { CreateAuditLogDto } from "../@types/index";
import { SearchAuditLogsDTO } from "../dtos/search-audit-logs.dto";
import { calculatePaginationParams } from "@common/utils/pagination/calculate-pagination-params.util";
import { selectAuditLogValidator } from "../validator/select-audit-log.validator";

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    return this._globalFacadeService.prismaService.auditLog.create({
      data: createAuditLogDto,
    });
  }

  async findAll(searchAuditLogsDTO: SearchAuditLogsDTO) {
    const { skip, take } = calculatePaginationParams(
      searchAuditLogsDTO.page,
      searchAuditLogsDTO.perPage,
    );

    const auditLogs =
      await this._globalFacadeService.prismaService.auditLog.findMany({
        skip,
        take,
        select: selectAuditLogValidator(),
        orderBy: { createdAt: "desc" },
      });
    const total = await this._globalFacadeService.prismaService.auditLog.count(
      {},
    );
    return { auditLogs, total };
  }

  async findOne(auditLogId: string) {
    return this._globalFacadeService.prismaService.auditLog.findUnique({
      where: { id: auditLogId },
      select: selectAuditLogValidator(),
    });
  }
}
