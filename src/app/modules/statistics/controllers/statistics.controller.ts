import { SystemEntitiesCountEntity } from "./../entities/system-entities-count.entity";
import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { StatisticsService } from "../services/statistics.service";
import { Roles } from "../../authentication/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { DateSearchDto } from "../dtos/date-search.dto";
import { Response } from "express";
@Controller({
  path: "statistics",
})
@Roles(Role.ADMIN)
@ApiTags(SWAGGER_TAGS.STATISTICS)
export class StatisticsController {
  constructor(private readonly _statisticsService: StatisticsService) {}

  @Get("system-entities-count")
  @ApiResponse({ type: SystemEntitiesCountEntity })
  async systemEntitiesStats() {
    return this._statisticsService.systemEntitiesStats();
  }

  @Get("csv/actors")
  async downloadActorsCsv(
    @Query() dateSearchDto: DateSearchDto,
    @Res() res: Response,
  ) {
    const csv = await this._statisticsService.actorsCsv(dateSearchDto);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="actors.csv"');
    return res.send(csv);
  }

  @Get("csv/agencies")
  async downloadAgenciesCsv(
    @Query() dateSearchDto: DateSearchDto,
    @Res() res: Response,
  ) {
    const csv = await this._statisticsService.agenciesCsv(dateSearchDto);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="agencies.csv"');
    return res.send(csv);
  }

  @Get("csv/complaints")
  async downloadComplaintsCsv(
    @Query() dateSearchDto: DateSearchDto,
    @Res() res: Response,
  ) {
    const csv = await this._statisticsService.complaintsCsv(dateSearchDto);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="complaints.csv"',
    );
    return res.send(csv);
  }
}
