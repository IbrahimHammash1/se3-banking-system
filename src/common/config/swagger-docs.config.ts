import { ErrorResponseEntity } from "@common/entities/serializedResponses/error-response.entity";
import { GlobalPaginatedResponseEntity } from "@common/entities/serializedResponses/global-paginated-response.entity";
import { GlobalResponseEntity } from "@common/entities/serializedResponses/global-response.entity";
import { ValidationErrorResponseEntity } from "@common/entities/serializedResponses/validation-error-response.entity";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { envConfig } from "./env-config";
import { SwaggerNotificationPayloadExtraModels } from "src/app/modules/notifications/entities/payload";

export const configureSwaggerDocs = (app) => {
  const config = new DocumentBuilder()
    .setTitle(envConfig.APP_NAME)
    .setVersion("1.0")
    .addBearerAuth()
    .addSecurityRequirements("bearer")
    .addGlobalParameters({
      in: "header",
      required: false,
      name: "Accept-Language",
      schema: {
        type: "string",
        enum: ["en", "ar"],
        example: "en",
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      GlobalResponseEntity,
      GlobalPaginatedResponseEntity,
      ErrorResponseEntity,
      ValidationErrorResponseEntity,
      ...SwaggerNotificationPayloadExtraModels,
    ],
  });

  const theme = new SwaggerTheme();
  const optionsClassic = theme.getDefaultConfig(SwaggerThemeNameEnum.CLASSIC);
  const optionsLight = theme.getDefaultConfig(SwaggerThemeNameEnum.NEWSPAPER);
  const optionsDark = theme.getDefaultConfig(SwaggerThemeNameEnum.DRACULA);
  // TODO replace the api-docs with index html custom docs
  SwaggerModule.setup("api-docs", app, document, {
    ...optionsClassic,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  SwaggerModule.setup("api-docs/light", app, document, {
    ...optionsLight,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  SwaggerModule.setup("api-docs/dark", app, document, {
    ...optionsDark,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};

export const SWAGGER_TAGS = {
  AUTHENTICATION: "Authentication APIS",
  CITIZEN: "Citizens APIS",
  COMPLAINT: "Complaints APIS",
  FILES: "Files APIS",
  GOVERNMENT_AGENCY: "Government Agencies APIS",
  ACTOR: "Actors APIS",
  DEVICES: "Devices APIS",
  NOTIFICATION: "Notifications APIS",
  STATISTICS: "Statistics APIS",
  AUDIT_LOGS: "Audit Logs APIS",
  BACKUP: "Backup APIS",
};
