import {
  PipeTransform,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";
import { Role } from "@prisma/client";

@Injectable()
export class ComplaintAuthorizationPipe implements PipeTransform<string> {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}

  async transform(value: string) {
    const role = this._globalFacadeService.role;
    const actorId = this._globalFacadeService.actorId;
    const governmentAgencyId = this._globalFacadeService.governmentAgencyId;
    if (role === Role.ADMIN) {
      return value;
    }
    const complaint =
      await this._globalFacadeService.prismaService.complaint.findUnique({
        where: { id: value },
        select: { citizenId: true, governmentAgencyId: true },
      });

    if (!complaint) {
      throw new NotFoundException("Complaint not found");
    }

    if (role === Role.CITIZEN && actorId !== complaint.citizenId) {
      throw new ForbiddenException(
        "You are not allowed to view this complaint",
      );
    }

    if (
      role === Role.EMPLOYEE &&
      governmentAgencyId !== complaint.governmentAgencyId
    ) {
      throw new ForbiddenException(
        "You are not allowed to view this complaint",
      );
    }
    return value;
  }
}
