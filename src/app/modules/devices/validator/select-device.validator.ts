import { Prisma } from "@prisma/client";

export const selectDeviceValidator = () => {
  return Prisma.validator<Prisma.DeviceSelect>()({
    id: true,
    fcmToken: true,
    language: true,
    platform: true,
    createdAt: true,
  });
};
export type DevicePayload = Prisma.DeviceGetPayload<{
  select: ReturnType<typeof selectDeviceValidator>;
}>;
