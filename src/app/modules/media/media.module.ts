import { Module } from "@nestjs/common";
import { MediaController } from "./controllers/media.controller";
import { MediaService } from "./services/media.service";
import { MulterModule } from "@nestjs/platform-express";
import { MediaRepository } from "./repositories/media.repository";
import * as path from "path";
@Module({
  imports: [
    MulterModule.register({
      dest: path.join(process.cwd(), "public"),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [],
})
export class MediaModule {}
