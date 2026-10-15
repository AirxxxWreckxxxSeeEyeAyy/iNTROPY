import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = {
  ...process.env,
  GIT_TERMINAL_PROMPT: "0",
  GCM_INTERACTIVE: "never",
  GCM_GUI_PROMPT: "false",
  GIT_SSH_COMMAND: "ssh -o BatchMode=yes",
};
function fail(message) {
  console.error(message);
  process.exit(1);
}
function git(args) {
  const result = spawnSync("git", args, {
    cwd: root, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error || result.status !== 0) {
    fail(result.error?.message || result.stderr.trim() || "Git command failed.");
  }
  return result.stdout.trim();
}
const args = process.argv.slice(2);
let remote, branch, dryRun = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--dry-run" && !dryRun) dryRun = true;
  else if (args[i] === "--remote" && !remote) remote = args[++i];
  else if (args[i] === "--branch" && !branch) branch = args[++i];
  else fail("Usage: npm run publish:github -- --remote <remote> --branch <branch> [--dry-run]");
}
if (!remote || !branch || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(remote) || branch.startsWith("-")) {
  fail("An explicit remote name and branch are required.");
}
git(["check-ref-format", "--branch", branch]);
if (git(["branch", "--show-current"]) !== branch) fail("Check out the requested branch before publishing.");
if (git(["status", "--porcelain"])) fail("Commit or preserve outstanding changes before publishing.");
const destination = git(["remote", "get-url", "--push", remote]);
if (!/^(https:\/\/github\.com\/|git@github\.com:)[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(destination)) {
  fail("The remote must be a GitHub HTTPS or SSH repository without embedded credentials.");
}
console.log((dryRun ? "Checking" : "Publishing") + " " + branch + " to " + destination);
const result = spawnSync("git", [
  "push", ...(dryRun ? ["--dry-run"] : []), remote, "HEAD:refs/heads/" + branch,
], { cwd: root, env, stdio: ["ignore", "inherit", "inherit"] });
if (result.error) console.error(result.error.message);
if (result.status !== 0) console.error("Push failed. Check existing Git authentication and repository access.");
process.exit(result.status ?? 1);
