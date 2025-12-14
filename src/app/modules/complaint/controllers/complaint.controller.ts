import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ComplaintService } from "../services/complaint.service";
import { Roles } from "../../authentication/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { CreateComplaintDto } from "../dto/create-complaint.dto";
import {
  ComplaintEntities,
  ComplaintEntity,
} from "../entities/complaint.entity";
import { SearchComplaintDTO } from "../dto/search-complaint.dto";
import { checkIfIdExist } from "@common/mixins/check-if-id-exist.pipe";
import { ComplaintAuthorizationPipe } from "../pipe/complaint-authorization.pipe";
import { UpdateComplaintDto } from "../dto/update-complaint.dto";
import { CreateComplaintExtraDataDto } from "../dto/create-complaint-extra-data.dto";
import {
  ComplaintExtraDataEntities,
  ComplaintExtraDataEntity,
} from "../entities/complaint-extra-data.entity";
import { SearchComplaintExtraDataDTO } from "../dto/search-complaint-extra-data.dto";
import { InsertComplaintExtraDataDto } from "../dto/insert-complaint-extra-data.dto";
import {
  ComplaintHistoryEntities,
  ComplaintHistoryEntity,
} from "../entities/complaint-history.entity";
import { Response } from "express";
import { SearchComplaintHistoryDTO } from "../dto/search-complaint-history.dto";
import { ComplaintPdfService } from "../services/complaint-pdf.service";

@Controller({
  path: "complaints",
})
@ApiTags(SWAGGER_TAGS.COMPLAINT)
export class ComplaintController {
  constructor(
    private readonly _complaintService: ComplaintService,
    private readonly _complaintPdfService: ComplaintPdfService,
  ) {}

  @Post("")
  @ApiResponse({ type: ComplaintEntity })
  @Roles(Role.CITIZEN)
  async create(@Body() createComplaintDto: CreateComplaintDto) {
    const complaint = await this._complaintService.create(createComplaintDto);
    return ComplaintEntity.createInstance(complaint);
  }

  @ApiResponse({ type: ComplaintEntities })
  @Get("")
  async findAll(@Query() searchComplaintDTO: SearchComplaintDTO) {
    const { complaints, meta } =
      await this._complaintService.findAll(searchComplaintDTO);
    return ComplaintEntities.createInstance({
      data: ComplaintEntity.createInstance(complaints),
      meta,
    });
  }

  @Get("download-pdf/:complaintId")
  async generateComplaintAsPdf(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Res() res: Response,
  ) {
    return this._complaintPdfService.generatePdfByComplaintId(complaintId, res);
  }

  @ApiResponse({ type: ComplaintHistoryEntities })
  @Get("complaint-history/:complaintId")
  async findComplaintHistory(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Query() searchComplaintHistoryDTO: SearchComplaintHistoryDTO,
  ) {
    const { complaintHistory, meta } =
      await this._complaintService.findComplaintHistory(
        searchComplaintHistoryDTO,
        complaintId,
      );
    return ComplaintHistoryEntities.createInstance({
      data: ComplaintHistoryEntity.createInstance(complaintHistory),
      meta,
    });
  }

  @ApiResponse({ type: ComplaintHistoryEntity })
  @Get("complaint-history/:complaintId/:complaintHistoryId")
  async findOneComplaintHistory(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Param("complaintHistoryId", checkIfIdExist("ComplaintHistory"))
    complaintHistoryId: string,
  ) {
    const complaintHistory =
      await this._complaintService.findOneComplaintHistory(
        complaintId,
        complaintHistoryId,
      );
    return ComplaintHistoryEntity.createInstance(complaintHistory!);
  }

  @Get(":complaintId")
  @ApiResponse({ type: ComplaintEntity })
  async findOne(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
  ) {
    const complaint = await this._complaintService.findOne(complaintId);
    return ComplaintEntity.createInstance(complaint!);
  }

  @Patch(":complaintId")
  @ApiResponse({ type: ComplaintEntity })
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async update(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    const complaint = await this._complaintService.update(
      complaintId,
      updateComplaintDto,
    );
    return ComplaintEntity.createInstance(complaint);
  }

  @Post("extra-data/:complaintId")
  @ApiResponse({ type: ComplaintEntity })
  @Roles(Role.EMPLOYEE)
  async createExtraData(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Body() createComplaintExtraDataDto: CreateComplaintExtraDataDto,
  ) {
    const complaint = await this._complaintService.createComplaintExtraData(
      createComplaintExtraDataDto,
      complaintId,
    );
    return ComplaintEntity.createInstance(complaint);
  }

  @ApiResponse({ type: ComplaintExtraDataEntities })
  @Get("extra-data/:complaintId")
  async findAllComplaintExtraData(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Query() searchComplaintExtraDataDTO: SearchComplaintExtraDataDTO,
  ) {
    const { complaintExtraData, meta } =
      await this._complaintService.findAllComplaintExtraData(
        searchComplaintExtraDataDTO,
        complaintId,
      );
    return ComplaintExtraDataEntities.createInstance({
      data: ComplaintExtraDataEntity.createInstance(complaintExtraData),
      meta,
    });
  }

  @ApiResponse({ type: ComplaintExtraDataEntity })
  @Patch("extra-data/:complaintId/:complaintExtraDataId")
  @Roles(Role.CITIZEN)
  async updateExtraData(
    @Param(
      "complaintId",
      ComplaintAuthorizationPipe,
      checkIfIdExist("Complaint"),
    )
    complaintId: string,
    @Param("complaintExtraDataId", checkIfIdExist("ComplaintExtraData"))
    complaintExtraDataId: string,
    @Body() insertComplaintExtraDataDto: InsertComplaintExtraDataDto,
  ) {
    const complaintExtraData =
      await this._complaintService.insertComplaintExtraData(
        insertComplaintExtraDataDto,
        complaintId,
        complaintExtraDataId,
      );
    return ComplaintExtraDataEntity.createInstance(complaintExtraData);
  }
}
