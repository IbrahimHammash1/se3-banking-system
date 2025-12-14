import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { SessionService } from "../services/session.service";
import { checkIfIdExist } from "@common/mixins/check-if-id-exist.pipe";
import { CitizenEntity } from "../../citizen/entities/citizen.entity";
import { VerifyOtpDto } from "../dtos/verify-otp.dto";
import { LoginDto } from "../dtos/login-dto";
import { LoginEntity } from "../entities/login.entity";
import { AuthenticationService } from "../services/authentication.service";
import { PublicRoute } from "../decorators/public.decorator";
import { ReCreateSessionDto } from "../dtos/recreate-session.dto";
import { SessionEntity } from "../entities/session.entity";
import { Throttle } from "@nestjs/throttler";
@Controller({
  path: "authentication",
})
@ApiTags(SWAGGER_TAGS.AUTHENTICATION)
@PublicRoute()
export class AuthenticationController {
  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _sessionService: SessionService,
  ) {}

  @Post("login")
  @ApiResponse({ type: LoginEntity })
  @Throttle({
    default: { limit: 5, ttl: 60000 },
  })
  login(@Body() loginDto: LoginDto) {
    return this._authenticationService.login(loginDto);
  }

  @Post("session")
  @ApiResponse({ type: SessionEntity })
  async create(@Body() reCreateSessionDto: ReCreateSessionDto) {
    const session =
      await this._sessionService.createSessionByActorEmailAndPhone(
        reCreateSessionDto,
      );
    return SessionEntity.createInstance(session);
  }
  @Patch("session/verify/:sessionId")
  @ApiResponse({ type: CitizenEntity })
  verify(
    @Param("sessionId", checkIfIdExist("Session")) sessionId: string,
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {
    return this._sessionService.verifyOtp(sessionId, verifyOtpDto.otpCode);
  }
}
