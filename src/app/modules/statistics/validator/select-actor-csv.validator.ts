import { Prisma } from "@prisma/client";

export const selectActorCsvValidator = () => {
  return Prisma.validator<Prisma.ActorSelect>()({
    id: true,
    fullName: true,
    nationalId: true,
    email: true,
    phone: true,
    role: true,
    accountStatus: true,
    createdAt: true,
    updatedAt: true,
  });
};
