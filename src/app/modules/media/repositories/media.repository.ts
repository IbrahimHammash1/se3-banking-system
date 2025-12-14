import { Injectable } from "@nestjs/common";
import { CreateMediaDTO } from "../dtos/create-media.dto";
import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { selectMediaValidator } from "../validators/select-media.validator";

@Injectable()
export class MediaRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  async create(createMediaDTO: CreateMediaDTO) {
    return this._globalFacadeService.prismaService.file.create({
      data: createMediaDTO,
      select: selectMediaValidator(),
    });
  }
}
