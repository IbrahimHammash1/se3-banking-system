import { Prisma } from "@prisma/client";

export const selectMediaValidator = () => {
  return Prisma.validator<Prisma.FileSelect>()({
    id: true,
    fileName: true,
    size: true,
    type: true,
  });
};
export type MediaPayload = Prisma.FileGetPayload<{
  select: ReturnType<typeof selectMediaValidator>;
}>;
