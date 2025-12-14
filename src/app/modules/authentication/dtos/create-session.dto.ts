import { Prisma } from "@prisma/client";

export type CreateSessionDto = Prisma.XOR<
  Prisma.SessionCreateInput,
  Prisma.SessionUncheckedCreateInput
>;

export enum OTP_METHOD {
  EMAIL = "EMAIL",
  SMS = "SMS",
  NONE = "NONE",
}
