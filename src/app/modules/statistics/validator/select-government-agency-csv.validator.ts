import { Prisma } from "@prisma/client";

export const selectGovernmentAgencyCsvValidator = () => {
  return Prisma.validator<Prisma.GovernmentAgencySelect>()({
    id: true,
    name: true,
    sector: true,
    createdAt: true,
    updatedAt: true,
  });
};
