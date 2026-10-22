import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
if (process.argv.length > 2) {
  console.error("Usage: npm run check");
  process.exit(64);
}
const checks = [
  [
    "TypeScript",
    ["node_modules/typescript/bin/tsc", "--noEmit", "--incremental", "false"],
  ],
  ["ESLint", ["node_modules/eslint/bin/eslint.js", ".", "--max-warnings=0"]],
  ["Scenario arithmetic", ["scripts/check-scenarios.mjs"]],
  ["Build", ["scripts/run-framework.mjs", "build"]],
];
let failed = false;
for (const [name, args] of checks) {
  console.log("\n" + name);
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    env: { ...process.env, CI: "true" },
    stdio: ["ignore", "inherit", "inherit"],
  });
  if (result.error) console.error(result.error.message);
  const passed = !result.error && result.status === 0;
  console.log(name + ": " + (passed ? "passed" : "failed"));
  failed ||= !passed;
}
process.exitCode = failed ? 1 : 0;
