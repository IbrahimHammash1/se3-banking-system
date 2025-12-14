import { calculatePaginationMetaData } from "@common/utils/pagination/calculate-pagination-meta-data.util";
import { CreateComplaintDto } from "../dto/create-complaint.dto";
import { SearchComplaintDTO } from "../dto/search-complaint.dto";
import { ComplaintRepository } from "./../repositories/complaint.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { UpdateComplaintDto } from "../dto/update-complaint.dto";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { ComplaintStatus, NotificationPurpose } from "@prisma/client";
import { CreateComplaintExtraDataDto } from "../dto/create-complaint-extra-data.dto";
import { SearchComplaintExtraDataDTO } from "../dto/search-complaint-extra-data.dto";
import { InsertComplaintExtraDataDto } from "../dto/insert-complaint-extra-data.dto";
import { isEqual } from "lodash";
import { ComplaintEntity } from "../entities/complaint.entity";
import { Propagation, Transactional } from "@nestjs-cls/transactional";
import { SearchComplaintHistoryDTO } from "../dto/search-complaint-history.dto";

@Injectable()
export class ComplaintService {
  constructor(
    private readonly _complaintRepository: ComplaintRepository,
    private readonly _globalFacadeService: GlobalFacadeService,
  ) {}

  async create(createComplaintDto: CreateComplaintDto) {
    const complaint =
      await this._complaintRepository.create(createComplaintDto);
    this._globalFacadeService.createAndEmitNotification({
      payload: {
        id: complaint.id,
        status: ComplaintStatus.NEW,
      },
      receiverId: this._globalFacadeService.actorId,
      purpose: NotificationPurpose.COMPLAINTS_STATUS_CHANGED,
    });
    return complaint;
  }

  async findAll(searchComplaintDTO: SearchComplaintDTO) {
    const { complaints, total } =
      await this._complaintRepository.findAll(searchComplaintDTO);
    const meta = calculatePaginationMetaData(
      total,
      searchComplaintDTO.page,
      searchComplaintDTO.perPage,
    );
    return { complaints, meta };
  }

  async findAllComplaintExtraData(
    searchComplaintExtraDataDTO: SearchComplaintExtraDataDTO,
    complaintId: string,
  ) {
    const { complaintExtraData, total } =
      await this._complaintRepository.getComplaintExtraData(
        searchComplaintExtraDataDTO,
        complaintId,
      );
    const meta = calculatePaginationMetaData(
      total,
      searchComplaintExtraDataDTO.page,
      searchComplaintExtraDataDTO.perPage,
    );
    return { complaintExtraData, meta };
  }

  async findOne(complaintId: string) {
    return this._complaintRepository.findOne(complaintId);
  }

  async findComplaintEntity(complaintId: string): Promise<ComplaintEntity> {
    const complaint = await this._complaintRepository.findOne(complaintId);
    return ComplaintEntity.createInstance(complaint!) as ComplaintEntity;
  }

  @Transactional(Propagation.Required)
  async update(complaintId: string, updateComplaintDto: UpdateComplaintDto) {
    const complaint = await this.findComplaintEntity(complaintId);
    const isEmployee = this._globalFacadeService.role !== "ADMIN";
    if (updateComplaintDto.status === ComplaintStatus.NEW && isEmployee) {
      throw new UnprocessableEntityException(`Can't update to initial status`);
    }
    if (
      (complaint.status === ComplaintStatus.DONE ||
        complaint.status === ComplaintStatus.REJECTED) &&
      isEmployee
    ) {
      throw new UnprocessableEntityException(
        `Complaint is already processed and it's ${complaint.status}`,
      );
    }
    if (
      complaint.processingByEmployeeId &&
      complaint.processingByEmployeeId !== this._globalFacadeService.actorId &&
      isEmployee
    ) {
      throw new UnprocessableEntityException(
        "Complaint is already being processed by another employee",
      );
    }
    const updatedFields = this.getUpdatedFields(complaint, updateComplaintDto);
    if (Object.keys(updatedFields).length >= 1 && isEmployee) {
      await this.saveComplaintHistory(
        complaint,
        complaint.processingByEmployeeId ?? this._globalFacadeService.actorId,
        updatedFields,
      );
    }
    let processingByEmployeeId: string | null | undefined = undefined;
    if (
      updateComplaintDto.status === ComplaintStatus.PROCESSING &&
      isEmployee
    ) {
      processingByEmployeeId = this._globalFacadeService.actorId;
    }
    if (updateComplaintDto.status === ComplaintStatus.ON_HOLD && isEmployee) {
      processingByEmployeeId = null;
    }
    const updatedComplaint = await this._complaintRepository.update(
      complaintId,
      {
        ...updateComplaintDto,
        processingByEmployeeId: processingByEmployeeId,
        complaintFiles: updateComplaintDto.complaintFiles ?? [],
      },
      complaint.version,
    );
    if (updateComplaintDto.status && isEmployee) {
      this._globalFacadeService.createAndEmitNotification({
        payload: {
          id: updatedComplaint.id,
          status: updatedComplaint.status,
        },
        receiverId: updatedComplaint.citizenId,
        purpose: NotificationPurpose.COMPLAINTS_STATUS_CHANGED,
      });
    }
    return updatedComplaint;
  }

  async createComplaintExtraData(
    createComplaintExtraDataDto: CreateComplaintExtraDataDto,
    complaintId: string,
  ) {
    const complaint = await this.findComplaintEntity(complaintId);

    const complaintExtraData =
      await this._complaintRepository.createComplaintExtraData(
        createComplaintExtraDataDto,
        complaintId,
        complaint.version,
      );
    this._globalFacadeService.createAndEmitNotification({
      payload: {
        id: complaintId,
      },
      purpose: NotificationPurpose.COMPLAINTS_MODIFICATION_REQUEST,
      receiverId: complaintExtraData.citizenId,
    });
    return complaintExtraData;
  }

  insertComplaintExtraData(
    insertComplaintExtraDataDto: InsertComplaintExtraDataDto,
    complaintId: string,
    complaintExtraDataId: string,
  ) {
    return this._complaintRepository.insertComplaintExtraData(
      insertComplaintExtraDataDto,
      complaintId,
      complaintExtraDataId,
    );
  }

  getUpdatedFields(
    oldComplaint: ComplaintEntity,
    updateComplaintDto: UpdateComplaintDto,
  ) {
    const updatedFields: Record<string, boolean> = {};
    for (const key of Object.keys(oldComplaint)) {
      if (key in updateComplaintDto) {
        const oldValue = oldComplaint[key];
        const newValue = updateComplaintDto[key];
        if (!isEqual(oldValue, newValue)) {
          updatedFields[key] = true;
        }
      }
    }
    return updatedFields;
  }

  async saveComplaintHistory(
    complaint: ComplaintEntity,
    updatedByEmployeeId: string,
    updatedFields: Record<string, boolean>,
  ) {
    const currentVersion = complaint.version || 1.0;
    await this._complaintRepository.createComplaintHistory({
      complaintId: complaint.id,
      version: currentVersion,
      type: complaint.type,
      status: complaint.status,
      address: complaint.address,
      problemDescription: complaint.problemDescription,
      extraInfo: complaint.extraInfo,
      employeeNotes: complaint.employeeNotes,
      governmentAgencyId: this._globalFacadeService.governmentAgencyId,
      processingByEmployeeId: this._globalFacadeService.actorId,
      updatedByEmployeeId: updatedByEmployeeId,
      updatedFields: updatedFields,
    });
    await this._complaintRepository.incrementComplaintVersion(complaint.id);
  }

  async findComplaintHistory(
    searchComplaintHistoryDTO: SearchComplaintHistoryDTO,
    complaintId: string,
  ) {
    const { complaintHistory, total } =
      await this._complaintRepository.findComplaintHistory(
        searchComplaintHistoryDTO,
        complaintId,
      );
    const meta = calculatePaginationMetaData(
      total,
      searchComplaintHistoryDTO.page,
      searchComplaintHistoryDTO.perPage,
    );
    return { complaintHistory, meta };
  }

  async findOneComplaintHistory(
    complaintId: string,
    complaintHistoryId: string,
  ) {
    return this._complaintRepository.findOneComplaintHistory(
      complaintId,
      complaintHistoryId,
    );
  }
}
