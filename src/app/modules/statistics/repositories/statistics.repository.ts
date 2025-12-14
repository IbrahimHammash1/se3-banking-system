import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { ComplaintStatus, Role } from "@prisma/client";
import { DateSearchDto } from "../dtos/date-search.dto";
import { selectActorCsvValidator } from "../validator/select-actor-csv.validator";
import { selectGovernmentAgencyCsvValidator } from "../validator/select-government-agency-csv.validator";
import { selectComplaintsCsvValidator } from "../validator/select-complaints-csv.validator";

@Injectable()
export class StatisticsRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  async countActors(role: Role) {
    return this._globalFacadeService.prismaService.actor.count({
      where: { role },
    });
  }

  async countGovernmentAgencies() {
    return this._globalFacadeService.prismaService.governmentAgency.count({});
  }

  async countComplaints(status: ComplaintStatus) {
    return this._globalFacadeService.prismaService.complaint.count({
      where: { status },
    });
  }

  async actorsCsv(dateSearchDto: DateSearchDto) {
    return this._globalFacadeService.prismaService.actor.findMany({
      where: {
        AND: [
          dateSearchDto.startDate
            ? { createdAt: { gte: new Date(dateSearchDto.startDate) } }
            : {},
          dateSearchDto.endDate
            ? { createdAt: { lte: new Date(dateSearchDto.endDate) } }
            : {},
        ],
      },
      select: selectActorCsvValidator(),
    });
  }

  async agenciesCsv(dateSearchDto: DateSearchDto) {
    return this._globalFacadeService.prismaService.governmentAgency.findMany({
      where: {
        AND: [
          dateSearchDto.startDate
            ? { createdAt: { gte: new Date(dateSearchDto.startDate) } }
            : {},
          dateSearchDto.endDate
            ? { createdAt: { lte: new Date(dateSearchDto.endDate) } }
            : {},
        ],
      },
      select: selectGovernmentAgencyCsvValidator(),
    });
  }

  async complaintsCsv(dateSearchDto: DateSearchDto) {
    return this._globalFacadeService.prismaService.complaint.findMany({
      where: {
        AND: [
          dateSearchDto.startDate
            ? { createdAt: { gte: new Date(dateSearchDto.startDate) } }
            : {},
          dateSearchDto.endDate
            ? { createdAt: { lte: new Date(dateSearchDto.endDate) } }
            : {},
        ],
      },
      select: selectComplaintsCsvValidator(),
    });
  }
}
