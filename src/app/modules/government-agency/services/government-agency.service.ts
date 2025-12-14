import { calculatePaginationMetaData } from "@common/utils/pagination/calculate-pagination-meta-data.util";
import { Injectable } from "@nestjs/common";
import { GovernmentAgencyRepository } from "../repositories/government-agency.repository";
import { CreateGovernmentAgencyDto } from "../dtos/create-government-agency.dto";
import { SearchGovernmentAgencyDTO } from "../dtos/search-government-agency.dto";
import { UpdateGovernmentAgencyDto } from "../dtos/update-government-agency.dto";

@Injectable()
export class GovernmentAgencyService {
  constructor(
    private readonly _governmentAgencyRepository: GovernmentAgencyRepository,
  ) {}

  create(createGovernmentAgencyDto: CreateGovernmentAgencyDto) {
    return this._governmentAgencyRepository.create(createGovernmentAgencyDto);
  }

  async findAll(searchGovernmentAgencyDTO: SearchGovernmentAgencyDTO) {
    const { governmentAgencies, total } =
      await this._governmentAgencyRepository.findAll(searchGovernmentAgencyDTO);
    const meta = calculatePaginationMetaData(
      total,
      searchGovernmentAgencyDTO.page,
      searchGovernmentAgencyDTO.perPage,
    );
    return { governmentAgencies, meta };
  }

  async findOne(governmentAgencyId: string) {
    return this._governmentAgencyRepository.findOne(governmentAgencyId);
  }

  async update(
    governmentAgencyId: string,
    updateGovernmentAgencyDto: UpdateGovernmentAgencyDto,
  ) {
    return this._governmentAgencyRepository.update(
      governmentAgencyId,
      updateGovernmentAgencyDto,
    );
  }
}
