import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();

  try {
    // await prisma.actor.create({
    //   data: {
    //     id: "admin-id",
    //     fullName: "Admin User",
    //     email: "admin@gmail.com",
    //     phone: "1234567890",
    //     password: await PasswordUtils.hashPassword("adminadmin"),
    //     accountStatus: "ACTIVE",
    //     role: "ADMIN",
    //   },
    // });
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
