import { Prisma } from "@prisma/client";

export const selectComplaintHistoryValidator = () => {
  return Prisma.validator<Prisma.ComplaintHistorySelect>()({
    id: true,
    address: true,
    status: true,
    type: true,
    version: true,
    problemDescription: true,
    employeeNotes: true,
    extraInfo: true,
    createdAt: true,
    processingByEmployeeId: true,
    updatedFields: true,
  });
};
export type ComplaintHistoryPayload = Prisma.ComplaintHistoryGetPayload<{
  select: ReturnType<typeof selectComplaintHistoryValidator>;
}>;
