import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { calculatePaginationParams } from "@common/utils/pagination/calculate-pagination-params.util";
import { CreateActorDto } from "../dtos/create-actor.dto";
import { selectActorValidator } from "../validators/select-actor.validator";
import { SearchActorDTO } from "../dtos/search-actor.dto";
import { UpdateActorDto } from "../dtos/update-actor.dto";

@Injectable()
export class ActorRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  create(createActorDto: CreateActorDto) {
    return this._globalFacadeService.prismaService.actor.create({
      data: createActorDto,
      select: selectActorValidator(),
    });
  }

  async findAll(searchActorDTO: SearchActorDTO) {
    const { skip, take } = calculatePaginationParams(
      searchActorDTO.page,
      searchActorDTO.perPage,
    );
    const actors = await this._globalFacadeService.prismaService.actor.findMany(
      {
        skip,
        take,
        where: { role: searchActorDTO.role },
        select: selectActorValidator(),
      },
    );
    const total = await this._globalFacadeService.prismaService.actor.count({
      where: { role: searchActorDTO.role },
    });
    return { actors, total };
  }

  async findOne(actorId: string) {
    return this._globalFacadeService.prismaService.actor.findUnique({
      where: { id: actorId },
      select: selectActorValidator(),
    });
  }

  update(actorId: string, updateActorDto: UpdateActorDto) {
    return this._globalFacadeService.prismaService.actor.update({
      where: {
        id: actorId,
      },
      data: updateActorDto,
      select: selectActorValidator(),
    });
  }
}
