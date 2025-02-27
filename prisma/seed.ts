import { PrismaClient, RoleStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      uuid: "87ca7b7a-700e-459c-82f2-1381c6fe090c",
      name: "ADMIN",
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      tags: "",
    },
    {
      uuid: "ae818b0a-5ff2-454d-be4a-1f7cfa4ed7bb",
      name: "TEACHER",
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      tags: "",
    },
    {
      uuid: "764fcf70-91f2-4caa-94f3-82a517f78f30",
      name: "STUDENT",
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      tags: "",
    },
  ];

  const privileges = [
    {
      uuid: "e2f4687a-1fbe-4871-89d0-510bd6c5b7c4",
      action: "#1100,",
      resource: "#role,",
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      role_uuid: "87ca7b7a-700e-459c-82f2-1381c6fe090c",
    },
    {
      uuid: "beddd438-f05b-4d8d-a5b5-8f03c81c9fff",
      action: "#1100,",
      resource: "#role,",
      status: RoleStatus.ACTIVE,
      date_created: new Date(),
      date_modified: new Date(),
      role_uuid: "ae818b0a-5ff2-454d-be4a-1f7cfa4ed7bb",
    },
    

  ]
  

  for (const role of roles) {
    await prisma.role.upsert({
      where: { uuid: role.uuid },
      update: role,
      create: role,
    });
  }

  for (const privilege of privileges) {
    await prisma.privilege.upsert({
      where: { uuid: privilege.uuid },
      update: privilege,
      create: privilege,
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
