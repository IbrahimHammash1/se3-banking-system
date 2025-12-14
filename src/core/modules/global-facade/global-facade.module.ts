import { Module } from "@nestjs/common";
import { Global } from "@nestjs/common";
import { GlobalFacadeService } from "./services/global-facade.service";

@Global()
@Module({
  imports: [],
  providers: [GlobalFacadeService],
  exports: [GlobalFacadeService],
})
export class GlobalFacadeModule {}
