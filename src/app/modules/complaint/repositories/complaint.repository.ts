import { Injectable } from "@nestjs/common";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { CreateComplaintDto } from "../dto/create-complaint.dto";
import { selectComplaintValidator } from "../validators/select-complaints.validator";
import { SearchComplaintDTO } from "../dto/search-complaint.dto";
import { calculatePaginationParams } from "@common/utils/pagination/calculate-pagination-params.util";
import { Role } from "@prisma/client";
import { UpdateComplaintDto } from "../dto/update-complaint.dto";
import { CreateComplaintExtraDataDto } from "../dto/create-complaint-extra-data.dto";
import { SearchComplaintExtraDataDTO } from "../dto/search-complaint-extra-data.dto";
import { selectComplaintExtraDataValidator } from "../validators/select-complaints-extra-data.validator";
import { InsertComplaintExtraDataDto } from "../dto/insert-complaint-extra-data.dto";
import { CreateComplaintHistoryLogDto } from "../@types";
import { SearchComplaintHistoryDTO } from "../dto/search-complaint-history.dto";
import { selectComplaintHistoryValidator } from "../validators/select-complaints-history.validator";

@Injectable()
export class ComplaintRepository {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  create(createComplaintDto: CreateComplaintDto) {
    return this._globalFacadeService.prismaService.complaint.create({
      data: {
        ...createComplaintDto,
        citizenId: this._globalFacadeService.actorId,
        complaintFiles: {
          createMany: {
            data: createComplaintDto.complaintFiles.map((file) => ({
              fileId: file,
            })),
          },
        },
      },
      select: selectComplaintValidator(),
    });
  }

  async findAll(searchComplaintDTO: SearchComplaintDTO) {
    const { skip, take } = calculatePaginationParams(
      searchComplaintDTO.page,
      searchComplaintDTO.perPage,
    );
    const searchQuery =
      this._globalFacadeService.role === Role.ADMIN
        ? {}
        : this._globalFacadeService.role === Role.CITIZEN
          ? {
              citizenId: this._globalFacadeService.actorId,
            }
          : {
              governmentAgencyId: this._globalFacadeService.governmentAgencyId,
            };
    const complaints =
      await this._globalFacadeService.prismaService.complaint.findMany({
        skip,
        take,
        where: searchQuery,
        select: selectComplaintValidator(),
      });
    const total = await this._globalFacadeService.prismaService.complaint.count(
      { where: searchQuery },
    );
    return { complaints, total };
  }

  async findOne(complaintId: string) {
    return this._globalFacadeService.prismaService.complaint.findUnique({
      where: { id: complaintId },
      select: selectComplaintValidator(),
    });
  }

  update(
    complaintId: string,
    updateComplaintDto: UpdateComplaintDto & {
      processingByEmployeeId?: string | null;
    },
    version: number,
  ) {
    return this._globalFacadeService.prismaService.complaint.update({
      where: {
        id: complaintId,
      },
      data: {
        ...updateComplaintDto,
        complaintFiles: {
          deleteMany: {},
          createMany: {
            data: updateComplaintDto.complaintFiles!.map((file) => ({
              fileId: file,
              version,
            })),
          },
        },
      },
      select: selectComplaintValidator(),
    });
  }

  createComplaintExtraData(
    createComplaintExtraDataDto: CreateComplaintExtraDataDto,
    complaintId: string,
    version: number,
  ) {
    return this._globalFacadeService.prismaService.complaint.update({
      where: { id: complaintId },
      data: {
        complaintExtraDatas: {
          createMany: {
            data: createComplaintExtraDataDto.keys.map((key) => ({
              key: key,
              version,
            })),
          },
        },
      },
      select: selectComplaintValidator(),
    });
  }

  async getComplaintExtraData(
    searchComplaintExtraDataDTO: SearchComplaintExtraDataDTO,
    complaintId: string,
  ) {
    const { skip, take } = calculatePaginationParams(
      searchComplaintExtraDataDTO.page,
      searchComplaintExtraDataDTO.perPage,
    );
    const complaintExtraData =
      await this._globalFacadeService.prismaService.complaintExtraData.findMany(
        {
          where: { complaintId },
          skip,
          take,
          select: selectComplaintExtraDataValidator(),
          orderBy: { createdAt: "desc" },
        },
      );
    const total =
      await this._globalFacadeService.prismaService.complaintExtraData.count({
        where: { complaintId },
      });
    return { complaintExtraData, total };
  }

  insertComplaintExtraData(
    insertComplaintExtraDataDto: InsertComplaintExtraDataDto,
    complaintId: string,
    complaintExtraDataId: string,
  ) {
    return this._globalFacadeService.prismaService.complaintExtraData.update({
      where: {
        id: complaintExtraDataId,
        complaintId,
      },
      data: insertComplaintExtraDataDto,
    });
  }

  async incrementComplaintVersion(complaintId: string) {
    return this._globalFacadeService.prismaService.complaint.update({
      where: { id: complaintId },
      data: { version: { increment: 1 } },
    });
  }

  async createComplaintHistory(
    createComplaintHistoryLogDto: CreateComplaintHistoryLogDto,
  ) {
    return this._globalFacadeService.prismaService.complaintHistory.create({
      data: createComplaintHistoryLogDto,
    });
  }

  async findComplaintHistory(
    searchComplaintHistoryDTO: SearchComplaintHistoryDTO,
    complaintId: string,
  ) {
    const { skip, take } = calculatePaginationParams(
      searchComplaintHistoryDTO.page,
      searchComplaintHistoryDTO.perPage,
    );
    const complaintHistory =
      await this._globalFacadeService.prismaService.complaintHistory.findMany({
        skip,
        take,
        where: { complaintId },
        select: selectComplaintHistoryValidator(),
        orderBy: {
          version: "desc",
        },
      });
    const total =
      await this._globalFacadeService.prismaService.complaintHistory.count({
        where: { complaintId },
      });
    return { complaintHistory, total };
  }

  async findOneComplaintHistory(
    complaintId: string,
    complaintHistoryId: string,
  ) {
    return this._globalFacadeService.prismaService.complaintHistory.findUnique({
      where: { id: complaintHistoryId, complaintId },
      select: selectComplaintHistoryValidator(),
    });
  }

  async complaintPdfInfo(complaintId: string) {
    return this._globalFacadeService.prismaService.complaint.findUnique({
      where: { id: complaintId },
      include: {
        citizen: true,
        employee: true,
        governmentAgency: true,
        complaintFiles: true,
        complaintExtraDatas: true,
        complaintHistories: {
          orderBy: { version: "asc" },
        },
      },
    });
  }
}
