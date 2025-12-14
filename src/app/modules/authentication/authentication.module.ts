import { Module } from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { SessionRepository } from "./repositories/session.repository";
import { AuthenticationController } from "./controllers/authentication.controller";
import { AuthenticationRepository } from "./repositories/authentication.repository";
import { JwtModule } from "@nestjs/jwt";
import { envConfig } from "@common/config/env-config";
import { StringValue } from "./constants";
import { AuthenticationService } from "./services/authentication.service";
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envConfig.JWT_SECRET,
      signOptions: {
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN as StringValue,
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    SessionService,
    SessionRepository,
    AuthenticationService,
    AuthenticationRepository,
  ],
  exports: [SessionService],
})
export class AuthenticationModule {}
