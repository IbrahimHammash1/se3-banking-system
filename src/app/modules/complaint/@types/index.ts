import { Prisma } from "@prisma/client";

export type CreateComplaintHistoryLogDto = Prisma.XOR<
  Prisma.ComplaintHistoryCreateInput,
  Prisma.ComplaintHistoryUncheckedCreateInput
>;
