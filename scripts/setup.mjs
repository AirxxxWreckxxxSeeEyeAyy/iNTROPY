import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
if (process.argv.length > 2) {
  console.error("Usage: npm run setup");
  process.exit(64);
}
const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(command, ["install", "--frozen-lockfile"], {
  cwd: root,
  env: { ...process.env, CI: "true" },
  stdio: ["ignore", "inherit", "inherit"],
  shell: process.platform === "win32",
});
if (result.error) console.error("Dependency installation failed:", result.error.message);
process.exit(result.status ?? 1);
