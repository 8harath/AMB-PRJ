import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.env.LOCAL_USER_EMAIL || "local@allweone.app";
const name = process.env.LOCAL_USER_NAME || "Local Workspace";

try {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      hasAccess: true,
      name,
    },
    create: {
      email,
      hasAccess: true,
      name,
      role: "ADMIN",
    },
  });

  console.log(`Local workspace user ready: ${user.email}`);
} catch (error) {
  console.error("Failed to seed local workspace user.", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
