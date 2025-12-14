import { Module } from "@nestjs/common";
import { StatisticsController } from "./controllers/statistics.controller";
import { StatisticsService } from "./services/statistics.service";
import { StatisticsRepository } from "./repositories/statistics.repository";

@Module({
  imports: [],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
  exports: [],
})
export class StatisticsModule {}
