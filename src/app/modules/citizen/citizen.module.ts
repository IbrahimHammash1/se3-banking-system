import { Module } from "@nestjs/common";
import { CitizenController } from "./controllers/citizen.controller";
import { CitizenService } from "./services/citizen.service";
import { CitizenRepository } from "./repositories/citizen.repository";
import { AuthenticationModule } from "../authentication/authentication.module";

@Module({
  imports: [AuthenticationModule],
  controllers: [CitizenController],
  providers: [CitizenService, CitizenRepository],
  exports: [],
})
export class CitizenModule {}
