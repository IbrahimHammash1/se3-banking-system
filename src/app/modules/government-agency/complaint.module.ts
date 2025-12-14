import { Module } from "@nestjs/common";
import { GovernmentAgencyController } from "./controllers/government-agency.controller";
import { GovernmentAgencyService } from "./services/government-agency.service";
import { GovernmentAgencyRepository } from "./repositories/government-agency.repository";

@Module({
  imports: [],
  controllers: [GovernmentAgencyController],
  providers: [GovernmentAgencyService, GovernmentAgencyRepository],
  exports: [],
})
export class GovernmentAgencyModule {}
