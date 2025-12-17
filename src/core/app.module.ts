import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { GlobalFacadeModule } from "./modules/global-facade/global-facade.module";
import { ClsModule } from "nestjs-cls";
import { clsOptions } from "@common/config/cls-options";
import { AuthenticationModule } from "src/app/modules/authentication/authentication.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/app/modules/authentication/guards/authentication.guard";
import { RolesGuard } from "src/app/modules/authentication/guards/authorization.guard";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { ActorModule } from "src/app/modules/actors/actor.module";
import { HeaderResolver, I18nModule } from "nestjs-i18n";
import { I18nMiddleware } from "./middlewares/i18n/i18n-language-header.middleware";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { envConfig } from "@common/config/env-config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { BackupModule } from "src/app/modules/backup/backup.module";
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 0, limit: 0 }],
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), "public"),
      serveRoot: envConfig.MEDIA_PATH,
    }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      typesOutputPath: path.join(
        process.cwd(),
        "src",
        "generated",
        "i18n.generated.ts",
      ),
      loaderOptions: {
        path: path.join(process.cwd(), "src", "i18n"),
        watch: true,
      },
      resolvers: [new HeaderResolver(["Accept-Language"])],
    }),
    PrismaModule,
    ClsModule.forRoot(clsOptions),
    GlobalFacadeModule,
    AuthenticationModule,
    ActorModule,
    BackupModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes("*");
  }
}
