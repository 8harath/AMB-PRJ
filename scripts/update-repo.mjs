import { spawnSync } from "node:child_process";

const commands = [
  ["git", ["fetch", "--all", "--prune"]],
  ["git", ["pull", "--rebase", "--autostash", "origin", "main"]],
];

for (const [command, args] of commands) {
  const resolvedCommand = process.platform === "win32" ? `${command}.cmd` : command;
  const result = spawnSync(resolvedCommand, args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Repository is up to date with origin/main.");
