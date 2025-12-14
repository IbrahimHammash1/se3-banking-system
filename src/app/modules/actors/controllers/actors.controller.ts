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
import { ActorService } from "../services/actor.service";
import { CreateActorDto } from "../dtos/create-actor.dto";
import { ActorEntities, ActorEntity } from "../entities/actor.entity";
import { UpdateActorDto, UpdateProfileDto } from "../dtos/update-actor.dto";
import { SearchActorDTO } from "../dtos/search-actor.dto";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
@Controller({
  path: "actors",
})
@ApiTags(SWAGGER_TAGS.ACTOR)
export class ActorController {
  constructor(
    private readonly _actorService: ActorService,
    private readonly _globalFacadeService: GlobalFacadeService,
  ) {}

  @Post("")
  @Roles(Role.ADMIN)
  @ApiResponse({ type: ActorEntity })
  async create(@Body() createActorDto: CreateActorDto) {
    const actor = await this._actorService.create(createActorDto);
    return ActorEntity.createInstance(actor);
  }

  @ApiResponse({ type: ActorEntities })
  @Get("")
  @Roles(Role.ADMIN)
  async findAll(@Query() searchActorDTO: SearchActorDTO) {
    const { actors, meta } = await this._actorService.findAll(searchActorDTO);
    return ActorEntities.createInstance({
      data: ActorEntity.createInstance(actors),
      meta,
    });
  }

  @Get("profile")
  @Roles(Role.ADMIN, Role.CITIZEN, Role.EMPLOYEE)
  @ApiResponse({ type: ActorEntity })
  async findProfile() {
    const actor = await this._actorService.findOne(
      this._globalFacadeService.actorId,
    );
    return ActorEntity.createInstance(actor!);
  }

  @Patch("profile")
  @Roles(Role.ADMIN, Role.CITIZEN, Role.EMPLOYEE)
  @ApiResponse({ type: ActorEntity })
  async updateProfile(
    @Body()
    updateActorDto: UpdateProfileDto,
  ) {
    const actor = await this._actorService.update(
      this._globalFacadeService.actorId,
      updateActorDto,
    );
    return ActorEntity.createInstance(actor);
  }

  @Get(":actorId")
  @Roles(Role.ADMIN)
  @ApiResponse({ type: ActorEntity })
  async findOne(
    @Param("actorId", checkIfIdExist("Actor"))
    actorId: string,
  ) {
    const actor = await this._actorService.findOne(actorId);
    return ActorEntity.createInstance(actor!);
  }

  @Patch(":actorId")
  @Roles(Role.ADMIN)
  @ApiResponse({ type: ActorEntity })
  async update(
    @Param("actorId", checkIfIdExist("Actor"))
    actorId: string,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    const actor = await this._actorService.update(actorId, updateActorDto);
    return ActorEntity.createInstance(actor);
  }
}
