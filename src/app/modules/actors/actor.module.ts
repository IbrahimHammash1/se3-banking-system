import { Module } from "@nestjs/common";
import { ActorController } from "./controllers/actors.controller";
import { ActorService } from "./services/actor.service";
import { ActorRepository } from "./repositories/actor.repository";

@Module({
  imports: [],
  controllers: [ActorController],
  providers: [ActorService, ActorRepository],
  exports: [],
})
export class ActorModule {}
