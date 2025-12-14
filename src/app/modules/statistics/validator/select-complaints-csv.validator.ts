import { Prisma } from "@prisma/client";

export const selectComplaintsCsvValidator = () => {
  return Prisma.validator<Prisma.ComplaintSelect>()({
    id: true,
    type: true,
    status: true,
    address: true,
    problemDescription: true,
    extraInfo: true,
    employeeNotes: true,
    version: true,
    createdAt: true,
    updatedAt: true,
    citizen: {
      select: { fullName: true, phone: true },
    },
    employee: {
      select: { fullName: true },
    },
    governmentAgency: {
      select: { name: true },
    },
  });
};
