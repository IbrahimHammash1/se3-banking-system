import { Prisma } from "@prisma/client";

export const selectNotificationValidator = () => {
  return Prisma.validator<Prisma.NotificationSelect>()({
    id: true,
    isSeen: true,
    isRead: true,
    payload: true,
    purpose: true,
    type: true,
    createdAt: true,
  });
};
export type NotificationPayload = Prisma.NotificationGetPayload<{
  select: ReturnType<typeof selectNotificationValidator>;
}>;
