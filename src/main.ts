import { NestFactory } from "@nestjs/core";
import { AppModule } from "./core/app.module";
import { envConfig } from "./common/config/env-config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { customValidationFormatter } from "@common/error-handling/utils/custom-validation-formatter";
import { configureSwaggerDocs } from "@common/config/swagger-docs.config";
import { PrismaExceptionFilter } from "@common/filters/prisma.exception.filter";
import * as expressBasicAuth from "express-basic-auth";
import * as path from "path";
import * as fs from "fs";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";

async function bootstrap() {
  const logger = new Logger(AppModule.name);
  const app = await NestFactory.create(AppModule);
  const port = envConfig.PORT;
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(GlobalFacadeService)),
    new PrismaExceptionFilter(),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "api/v",
    defaultVersion: "1",
  });
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Version"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // transformOptions: { enableImplicitConversion: true },
      exceptionFactory: customValidationFormatter,
    }),
  );
  app.use(
    ["/api-docs", "/api-docs-json", "/api-docs-yaml"],
    expressBasicAuth({
      users: { [envConfig.SWAGGER_USERNAME]: envConfig.SWAGGER_PASSWORD },
      challenge: true,
      realm: "Swagger API Docs",
    }),
  );
  const projectRoot = process.cwd();
  const publicDirectory = path.join(projectRoot, "public");
  try {
    await fs.promises.mkdir(publicDirectory);
  } catch {
    Logger.log(`${publicDirectory} already exist`);
  }
  configureSwaggerDocs(app);
  await app.listen(port);

  logger.verbose(`Current environment: ${envConfig.CURRENT_ENV}`);
  logger.log(`Server is up and running on port ${port} ... `);
  logger.log(`Server is running on ${envConfig.BASE_URL}`);
}
bootstrap();
