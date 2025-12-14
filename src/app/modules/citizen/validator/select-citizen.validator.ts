import { Prisma } from "@prisma/client";
import { selectMediaValidator } from "../../media/validators/select-media.validator";

export const selectCitizenValidator = () => {
  return Prisma.validator<Prisma.ActorSelect>()({
    id: true,
    fullName: true,
    nationalId: true,
    email: true,
    phone: true,
    createdAt: true,
    image: {
      select: selectMediaValidator(),
    },
  });
};
export type CitizenPayload = Prisma.ActorGetPayload<{
  select: ReturnType<typeof selectCitizenValidator>;
}>;
