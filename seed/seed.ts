import { PasswordUtils } from "../src/common/utils/hashing/password.util";
import { Prisma, PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();

  try {
    await prisma.actor.create({
      data: {
        id: "admin-id",
        fullName: "Admin User",
        email: "admin@gmail.com",
        phone: "1234567890",
        password: await PasswordUtils.hashPassword("adminadmin"),
        accountStatus: "ACTIVE",
        role: "ADMIN",
      },
    });

    const agencies = [
      {
        name: "Environmental Protection Agency",
        sector: "ENVIRONMENTAL",
        employees: [
          {
            fullName: "John Doe",
            email: "john.doe@epa.gov",
            phone: "1234567891",
            password: "emp123",
            accountStatus: "ACTIVE",
            role: "EMPLOYEE",
          },
        ],
      },
      {
        name: "Health Services Department",
        sector: "HEALTH",
        employees: [
          {
            fullName: "Jane Smith",
            email: "jane.smith@health.gov",
            phone: "1234567892",
            password: "emp123",
            accountStatus: "ACTIVE",
            role: "EMPLOYEE",
          },
        ],
      },
      {
        name: "Transportation Authority",
        sector: "TRANSPORTATION",
        employees: [
          {
            fullName: "Bob Johnson",
            email: "bob.johnson@ta.gov",
            phone: "1234567893",
            password: "emp123",
            accountStatus: "ACTIVE",
            role: "EMPLOYEE",
          },
        ],
      },
    ];

    for (const agency of agencies) {
      await prisma.governmentAgency.create({
        data: {
          name: agency.name,
          sector: agency.sector,
          employees: {
            create: {
              ...agency.employees[0],
              password: await PasswordUtils.hashPassword(
                agency.employees[0].password,
              ),
            } as Prisma.ActorCreateWithoutGovernmentAgencyInput,
          },
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
