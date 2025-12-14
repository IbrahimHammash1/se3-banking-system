import { Prisma } from "@prisma/client";

export type CreateAuditLogDto = Prisma.XOR<
  Prisma.AuditLogCreateInput,
  Prisma.AuditLogUncheckedCreateInput
>;
