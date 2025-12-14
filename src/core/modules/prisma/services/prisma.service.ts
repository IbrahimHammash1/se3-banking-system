import * as process from "process";
import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { envConfig, NODE_ENVS } from "src/common/config/env-config";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "info" },
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
      ],
      transactionOptions: { timeout: 20_000 },
    });
  }

  async onModuleInit() {
    this.logger.log("connecting to database...");
    await this.$connect();
    this.logger.log("connected to database");
  }
  async onApplicationShutdown() {
    await this.$disconnect();
    this.logger.warn("Shutting down ...");
    if (envConfig.CURRENT_ENV != NODE_ENVS.TEST) {
      process.exit(0);
    }
  }
}
