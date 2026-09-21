import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Installs the packed tarball into throwaway ESM and CommonJS consumer
// projects and exercises the public API through both module systems, the
// way an external application would, rather than resolving repository
// source directly.

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workDir = mkdtempSync(path.join(tmpdir(), "payment-channels-pack-"));

const fixture = {
  phoneNumber: "0712 345 678",
  description: " settlement ",
};
const expected = {
  phoneNumber: "+254712345678",
  description: "settlement",
};

try {
  // --ignore-scripts: this repo's own "prepack" script runs "npm run check",
  // which runs this file. Without --ignore-scripts, packing here would
  // recursively re-trigger the check that is already in progress.
  const tarballName = execFileSync("npm", ["pack", "--silent", "--ignore-scripts", "--pack-destination", workDir], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  const tarballPath = path.join(workDir, tarballName);

  const esmResult = runConsumer({
    kind: "esm",
    manifest: { type: "module" },
    script: `
      import { createPaymentChannelRegistry, validatePaymentChannelData } from "@minmoto/payment-channels";
      const registry = createPaymentChannelRegistry();
      const schema = registry.get("mpesa_phone_ke_kes");
      const result = validatePaymentChannelData(schema, ${JSON.stringify(fixture)});
      console.log(JSON.stringify(result.data));
    `,
    scriptName: "run.mjs",
    tarballPath,
  });

  const cjsResult = runConsumer({
    kind: "cjs",
    manifest: { type: "commonjs" },
    script: `
      const { createPaymentChannelRegistry, validatePaymentChannelData } = require("@minmoto/payment-channels");
      const registry = createPaymentChannelRegistry();
      const schema = registry.get("mpesa_phone_ke_kes");
      const result = validatePaymentChannelData(schema, ${JSON.stringify(fixture)});
      console.log(JSON.stringify(result.data));
    `,
    scriptName: "run.cjs",
    tarballPath,
  });

  assert.deepEqual(esmResult, expected, "ESM consumer result did not match the expected fixture");
  assert.deepEqual(cjsResult, expected, "CommonJS consumer result did not match the expected fixture");
  assert.deepEqual(esmResult, cjsResult, "ESM and CommonJS consumers returned different results for the same fixture");

  console.log("verify:pack passed for ESM and CommonJS consumers");
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

function runConsumer({ kind, manifest, script, scriptName, tarballPath }) {
  const consumerDir = path.join(workDir, `${kind}-consumer`);
  mkdirSync(consumerDir, { recursive: true });
  writeFileSync(
    path.join(consumerDir, "package.json"),
    JSON.stringify(
      {
        name: `${kind}-consumer`,
        version: "0.0.0",
        private: true,
        ...manifest,
      },
      null,
      2,
    ),
  );

  execFileSync("npm", ["install", "--no-audit", "--no-fund", "--no-save", "--ignore-scripts", tarballPath], {
    cwd: consumerDir,
    stdio: "pipe",
  });

  writeFileSync(path.join(consumerDir, scriptName), script);

  const output = execFileSync("node", [scriptName], {
    cwd: consumerDir,
    encoding: "utf8",
  });
  return JSON.parse(output.trim());
}
