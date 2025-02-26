import { Role, RoleStatus, RoleType } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

async function main() {
  const roles: Role[] = [
    {
      uuid: "87ca7b7a-700e-459c-82f2-1381c6fe090c",
      name: RoleType.ADMIN,
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      tags: "",
    },
    {
      uuid: "764fcf70-91f2-4caa-94f3-82a517f78f30",
      name: RoleType.TEACHER,
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      tags: "",
    },
    {
      uuid: "764fcf70-91f2-4caa-94f3-82a517f78f30",
      name: RoleType.STUDENT,
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      tags: "",
    },
  ];

  for (const role of roles) {
    await prisma.Role.upsert({
      where: { uuid: role.uuid },
      update: role,
      create: role,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
