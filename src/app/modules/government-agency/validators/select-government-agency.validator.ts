import { Prisma } from "@prisma/client";

export const selectGovernmentAgencyValidator = () => {
  return Prisma.validator<Prisma.GovernmentAgencySelect>()({
    id: true,
    name: true,
    sector: true,
    createdAt: true,
  });
};
export type GovernmentAgencyPayload = Prisma.GovernmentAgencyGetPayload<{
  select: ReturnType<typeof selectGovernmentAgencyValidator>;
}>;
