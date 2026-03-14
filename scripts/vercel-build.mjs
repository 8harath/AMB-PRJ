import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL,
};

if (!env.DATABASE_URL) {
  console.error("Missing DATABASE_URL for Vercel build.");
  process.exit(1);
}

if (!env.DIRECT_URL) {
  console.error(
    "Missing DIRECT_URL and DATABASE_URL for Vercel build Prisma commands.",
  );
  process.exit(1);
}

const commands = [
  ["npx", ["prisma", "generate"]],
  ["npx", ["prisma", "db", "push"]],
  ["npx", ["next", "build", "--turbo"]],
];

for (const [command, args] of commands) {
  const resolvedCommand = process.platform === "win32" ? `${command}.cmd` : command;
  const result = spawnSync(resolvedCommand, args, {
    env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
