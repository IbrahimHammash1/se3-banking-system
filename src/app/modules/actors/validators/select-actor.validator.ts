import { Prisma } from "@prisma/client";

export const selectActorValidator = () => {
  return Prisma.validator<Prisma.ActorSelect>()({
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    accountStatus: true,
    createdAt: true,
  });
};
export type ActorPayload = Prisma.ActorGetPayload<{
  select: ReturnType<typeof selectActorValidator>;
}>;
