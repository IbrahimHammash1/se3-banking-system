import { Prisma } from "@prisma/client";

export const selectComplaintExtraDataValidator = () => {
  return Prisma.validator<Prisma.ComplaintExtraDataSelect>()({
    id: true,
    key: true,
    value: true,
    version: true,
    createdAt: true,
  });
};
export type ComplaintExtraDataPayload = Prisma.ComplaintExtraDataGetPayload<{
  select: ReturnType<typeof selectComplaintExtraDataValidator>;
}>;
