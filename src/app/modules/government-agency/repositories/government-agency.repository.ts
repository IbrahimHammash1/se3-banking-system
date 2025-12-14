import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { calculatePaginationParams } from "@common/utils/pagination/calculate-pagination-params.util";
import { CreateGovernmentAgencyDto } from "../dtos/create-government-agency.dto";
import { selectGovernmentAgencyValidator } from "../validators/select-government-agency.validator";
import { SearchGovernmentAgencyDTO } from "../dtos/search-government-agency.dto";
import { UpdateGovernmentAgencyDto } from "../dtos/update-government-agency.dto";

@Injectable()
export class GovernmentAgencyRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  create(createGovernmentAgencyDto: CreateGovernmentAgencyDto) {
    return this._globalFacadeService.prismaService.governmentAgency.create({
      data: createGovernmentAgencyDto,
      select: selectGovernmentAgencyValidator(),
    });
  }

  async findAll(searchGovernmentAgencyDTO: SearchGovernmentAgencyDTO) {
    const { skip, take } = calculatePaginationParams(
      searchGovernmentAgencyDTO.page,
      searchGovernmentAgencyDTO.perPage,
    );
    const governmentAgencies =
      await this._globalFacadeService.prismaService.governmentAgency.findMany({
        skip,
        take,
        select: selectGovernmentAgencyValidator(),
      });
    const total =
      await this._globalFacadeService.prismaService.governmentAgency.count();
    return { governmentAgencies, total };
  }

  async findOne(governmentAgencyId: string) {
    return this._globalFacadeService.prismaService.governmentAgency.findUnique({
      where: { id: governmentAgencyId },
      select: selectGovernmentAgencyValidator(),
    });
  }

  update(
    governmentAgencyId: string,
    updateGovernmentAgencyDto: UpdateGovernmentAgencyDto,
  ) {
    return this._globalFacadeService.prismaService.governmentAgency.update({
      where: {
        id: governmentAgencyId,
      },
      data: updateGovernmentAgencyDto,
      select: selectGovernmentAgencyValidator(),
    });
  }
}
