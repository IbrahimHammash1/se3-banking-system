import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../authentication/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { checkIfIdExist } from "@common/mixins/check-if-id-exist.pipe";
import { GovernmentAgencyService } from "../services/government-agency.service";
import {
  GovernmentAgencyEntities,
  GovernmentAgencyEntity,
} from "../entities/government-agency.entity";
import { CreateGovernmentAgencyDto } from "../dtos/create-government-agency.dto";
import { SearchGovernmentAgencyDTO } from "../dtos/search-government-agency.dto";
import { UpdateGovernmentAgencyDto } from "../dtos/update-government-agency.dto";

@Controller({
  path: "government-agencies",
})
@ApiTags(SWAGGER_TAGS.GOVERNMENT_AGENCY)
export class GovernmentAgencyController {
  constructor(
    private readonly _governmentAgencyService: GovernmentAgencyService,
  ) {}

  @Post("")
  @ApiResponse({ type: GovernmentAgencyEntity })
  @Roles(Role.ADMIN)
  async create(@Body() createGovernmentAgencyDto: CreateGovernmentAgencyDto) {
    const governmentAgency = await this._governmentAgencyService.create(
      createGovernmentAgencyDto,
    );
    return GovernmentAgencyEntity.createInstance(governmentAgency);
  }

  @ApiResponse({ type: GovernmentAgencyEntities })
  @Get("")
  async findAll(@Query() searchGovernmentAgencyDTO: SearchGovernmentAgencyDTO) {
    const { governmentAgencies, meta } =
      await this._governmentAgencyService.findAll(searchGovernmentAgencyDTO);
    return GovernmentAgencyEntities.createInstance({
      data: GovernmentAgencyEntity.createInstance(governmentAgencies),
      meta,
    });
  }

  @Get(":governmentAgencyId")
  @ApiResponse({ type: GovernmentAgencyEntity })
  async findOne(
    @Param("governmentAgencyId", checkIfIdExist("GovernmentAgency"))
    governmentAgencyId: string,
  ) {
    const governmentAgency =
      await this._governmentAgencyService.findOne(governmentAgencyId);
    return GovernmentAgencyEntity.createInstance(governmentAgency!);
  }

  @Patch(":governmentAgencyId")
  @ApiResponse({ type: GovernmentAgencyEntity })
  @Roles(Role.ADMIN)
  async update(
    @Param("governmentAgencyId", checkIfIdExist("GovernmentAgency"))
    governmentAgencyId: string,
    @Body() updateGovernmentAgencyDto: UpdateGovernmentAgencyDto,
  ) {
    const governmentAgency = await this._governmentAgencyService.update(
      governmentAgencyId,
      updateGovernmentAgencyDto,
    );
    return GovernmentAgencyEntity.createInstance(governmentAgency);
  }
}
