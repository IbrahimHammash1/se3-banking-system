import { Injectable } from "@nestjs/common";
import { StatisticsRepository } from "../repositories/statistics.repository";
import { Role, ComplaintStatus } from "@prisma/client";
import { DateSearchDto } from "../dtos/date-search.dto";
import { Parser } from "json2csv";
import {
  actorsCsvTableColumns,
  agenciesCsvTableColumns,
  complaintsCsvTableColumns,
} from "../constant/csv.constants";
@Injectable()
export class StatisticsService {
  constructor(private readonly _statisticsRepository: StatisticsRepository) {}

  async systemEntitiesStats() {
    return {
      citizensCount: await this._statisticsRepository.countActors(Role.CITIZEN),
      employeesCount: await this._statisticsRepository.countActors(
        Role.EMPLOYEE,
      ),
      adminsCount: await this._statisticsRepository.countActors(Role.ADMIN),
      agenciesCount: await this._statisticsRepository.countGovernmentAgencies(),
      newComplaintsCount: await this._statisticsRepository.countComplaints(
        ComplaintStatus.NEW,
      ),
      onHoldComplaintsCount: await this._statisticsRepository.countComplaints(
        ComplaintStatus.ON_HOLD,
      ),
      doneComplaintsCount: await this._statisticsRepository.countComplaints(
        ComplaintStatus.DONE,
      ),
      rejectedComplaintsCount: await this._statisticsRepository.countComplaints(
        ComplaintStatus.REJECTED,
      ),
      processingComplaintsCount:
        await this._statisticsRepository.countComplaints(
          ComplaintStatus.PROCESSING,
        ),
    };
  }

  async actorsCsv(dateSearchDto: DateSearchDto) {
    const actors = await this._statisticsRepository.actorsCsv(dateSearchDto);
    const parser = new Parser({ actorsCsvTableColumns });
    const csv = parser.parse(actors);
    return csv;
  }

  async agenciesCsv(dateSearchDto: DateSearchDto) {
    const agencies =
      await this._statisticsRepository.agenciesCsv(dateSearchDto);
    const parser = new Parser({ agenciesCsvTableColumns });
    const csv = parser.parse(agencies);
    return csv;
  }

  async complaintsCsv(dateSearchDto: DateSearchDto) {
    const complaints =
      await this._statisticsRepository.complaintsCsv(dateSearchDto);
    const flatData = complaints.map((c) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      address: c.address,
      problemDescription: c.problemDescription,
      extraInfo: c.extraInfo,
      employeeNotes: c.employeeNotes,
      version: c.version,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      citizenName: c.citizen?.fullName ?? "",
      citizenPhone: c.citizen?.phone ?? "",
      employeeName: c.employee?.fullName ?? "",
      agencyName: c.governmentAgency?.name ?? "",
    }));

    const parser = new Parser({ complaintsCsvTableColumns });
    const csv = parser.parse(flatData);
    return csv;
  }
}
