import { spawnSync } from "node:child_process";

const repository = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { encoding: "utf8" });
if (repository.status !== 0 || repository.stdout.trim() !== "true") process.exit(0);

const configured = spawnSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });
if (configured.status !== 0) process.exit(configured.status ?? 1);
