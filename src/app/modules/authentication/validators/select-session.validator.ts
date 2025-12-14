import { Prisma } from "@prisma/client";

export const selectSessionValidator = () => {
  return Prisma.validator<Prisma.SessionSelect>()({
    id: true,
    retriesCount: true,
    type: true,
    otpExpireAt: true,
    expireAt: true,
    actorId: true,
  });
};
export type SessionPayload = Prisma.SessionGetPayload<{
  select: ReturnType<typeof selectSessionValidator>;
}>;
