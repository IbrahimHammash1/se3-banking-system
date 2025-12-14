import { Prisma } from "@prisma/client";
import { selectMediaValidator } from "../../media/validators/select-media.validator";
import { selectGovernmentAgencyValidator } from "../../government-agency/validators/select-government-agency.validator";

export const selectActorValidator = () => {
  return Prisma.validator<Prisma.ActorSelect>()({
    id: true,
    fullName: true,
    nationalId: true,
    email: true,
    phone: true,
    role: true,
    governmentAgency: { select: selectGovernmentAgencyValidator() },
    accountStatus: true,
    createdAt: true,
    image: {
      select: selectMediaValidator(),
    },
  });
};
export type ActorPayload = Prisma.ActorGetPayload<{
  select: ReturnType<typeof selectActorValidator>;
}>;
