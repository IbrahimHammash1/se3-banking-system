import { Prisma } from "@prisma/client";
import { selectGovernmentAgencyValidator } from "../../government-agency/validators/select-government-agency.validator";
import { selectMediaValidator } from "../../media/validators/select-media.validator";

export const selectComplaintValidator = () => {
  return Prisma.validator<Prisma.ComplaintSelect>()({
    id: true,
    address: true,
    governmentAgency: { select: selectGovernmentAgencyValidator() },
    complaintFiles: {
      select: { file: { select: selectMediaValidator() } },
    },
    status: true,
    type: true,
    version: true,
    problemDescription: true,
    employeeNotes: true,
    extraInfo: true,
    createdAt: true,
    processingByEmployeeId: true,
    citizenId: true,
  });
};
export type ComplaintPayload = Prisma.ComplaintGetPayload<{
  select: ReturnType<typeof selectComplaintValidator>;
}>;
