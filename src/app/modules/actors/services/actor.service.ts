import { calculatePaginationMetaData } from "@common/utils/pagination/calculate-pagination-meta-data.util";
import { Injectable } from "@nestjs/common";
import { ActorRepository } from "../repositories/actor.repository";
import { CreateActorDto } from "../dtos/create-actor.dto";
import { SearchActorDTO } from "../dtos/search-actor.dto";
import { UpdateActorDto } from "../dtos/update-actor.dto";
import { PasswordUtils } from "@common/utils/hashing/password.util";
@Injectable()
export class ActorService {
  constructor(private readonly _actorRepository: ActorRepository) {}

  async create(createActorDto: CreateActorDto) {
    return this._actorRepository.create({
      ...createActorDto,
      password: await PasswordUtils.hashPassword(createActorDto.password),
    });
  }

  async findAll(searchActorDTO: SearchActorDTO) {
    const { actors, total } =
      await this._actorRepository.findAll(searchActorDTO);
    const meta = calculatePaginationMetaData(
      total,
      searchActorDTO.page,
      searchActorDTO.perPage,
    );
    return { actors, meta };
  }

  async findOne(actorId: string) {
    return this._actorRepository.findOne(actorId);
  }

  async update(actorId: string, updateActorDto: UpdateActorDto) {
    return this._actorRepository.update(actorId, {
      ...updateActorDto,
      password: updateActorDto.password
        ? await PasswordUtils.hashPassword(updateActorDto.password)
        : undefined,
    });
  }
}
