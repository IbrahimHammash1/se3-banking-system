import { Injectable } from "@nestjs/common";
import { AuditLogsRepository } from "../repositories/audit-logs.repository";
import { CreateAuditLogDto } from "../@types";
import { SearchAuditLogsDTO } from "../dtos/search-audit-logs.dto";
import { calculatePaginationMetaData } from "@common/utils/pagination/calculate-pagination-meta-data.util";

@Injectable()
export class AuditLogsService {
  constructor(private readonly _auditLogsRepository: AuditLogsRepository) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    return this._auditLogsRepository.create(createAuditLogDto);
  }

  async findAll(searchAuditLogsDTO: SearchAuditLogsDTO) {
    const { auditLogs, total } =
      await this._auditLogsRepository.findAll(searchAuditLogsDTO);

    const meta = calculatePaginationMetaData(
      total,
      searchAuditLogsDTO.page,
      searchAuditLogsDTO.perPage,
    );
    return { auditLogs, meta };
  }

  async findOne(auditLogId: string) {
    return this._auditLogsRepository.findOne(auditLogId);
  }
}
