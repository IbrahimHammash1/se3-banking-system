import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterCitizenAccountDto } from "../dtos/register-citizen-account.dto";
import { CitizenService } from "../services/citizen.service";
import { SessionEntity } from "../../authentication/entities/session.entity";
import { PublicRoute } from "../../authentication/decorators/public.decorator";

@Controller({
  path: "citizens",
})
@ApiTags(SWAGGER_TAGS.CITIZEN)
export class CitizenController {
  constructor(private readonly _citizenService: CitizenService) {}
  @Post("register")
  @PublicRoute()
  @ApiResponse({ type: SessionEntity })
  async register(@Body() registerCitizenAccountDto: RegisterCitizenAccountDto) {
    const session = await this._citizenService.register(
      registerCitizenAccountDto,
    );
    return SessionEntity.createInstance(session);
  }
}
