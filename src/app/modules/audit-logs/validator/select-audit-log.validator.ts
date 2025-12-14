import { Prisma } from "@prisma/client";

export const selectAuditLogValidator = () => {
  return Prisma.validator<Prisma.AuditLogSelect>()({
    id: true,
    createdAt: true,
    method: true,
    ip: true,
    statusCode: true,
    url: true,
    platform: true,
    userAgent: true,
    duration: true,
    errorMessage: true,
    errorStack: true,
    userActor: {
      select: {
        id: true,
        fullName: true,
      },
    },
  });
};
export type AuditLogPayload = Prisma.AuditLogGetPayload<{
  select: ReturnType<typeof selectAuditLogValidator>;
}>;
