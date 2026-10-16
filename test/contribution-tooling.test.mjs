import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";
import { builtinPaymentChannels } from "../dist/esm/index.js";
import { contributionCoverageOutput, validateEvidence } from "../scripts/contribution-coverage.mjs";
import { scaffoldCashChannel } from "../scripts/scaffold-cash-channel.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const research = "https://github.com/minmoto/payment-channels/issues/123";

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "payment-channel-contribution-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(path.join(root, "src"), path.join(directory, "src"), { recursive: true });
  await mkdir(path.join(directory, "test"));
  await cp(path.join(root, "test/payment-channels.test.mjs"), path.join(directory, "test/payment-channels.test.mjs"));
  await mkdir(path.join(directory, "contributing"));
  await writeFile(path.join(directory, "contributing/evidence.json"), JSON.stringify({ version: 1, records: [] }));
  await writeFile(path.join(directory, "package.json"), '{"type":"module"}');
  return directory;
}

async function compileAndInspect(directory) {
  const config = ts.parseJsonConfigFileContent(
    {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        skipLibCheck: true,
        rootDir: "src",
        outDir: "dist/esm",
      },
      include: ["src/**/*.ts"],
    },
    ts.sys,
    directory,
  );
  const program = ts.createProgram(config.fileNames, config.options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("\n"),
  );
  assert.equal(program.emit().emitSkipped, false);
  const result = await import(pathToFileURL(path.join(directory, "dist/esm/index.js")).href);
  const tests = await readFile(path.join(directory, "test/payment-channels.test.mjs"), "utf8");
  const inventoryTest = tests.match(/test\("every represented country has a built-in cash channel",[\s\S]*?\n\}\);/)[0];
  const expectedIds = [...inventoryTest.matchAll(/"(cash_[a-z_]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    result.builtinPaymentChannels.filter((schema) => schema.display.group === "cash").map((schema) => schema.id),
    expectedIds,
  );
  return result;
}

test("cash scaffold compiles, exports the new channel, and preserves the original registry", async (t) => {
  const directory = await fixture(t);
  await scaffoldCashChannel(directory, { country: "XZ", currency: "XTS", evidence: research });
  const result = await compileAndInspect(directory);
  assert.deepEqual(result.builtinPaymentChannels.slice(0, -1), builtinPaymentChannels);
  const schema = result.cashXzXtsPaymentChannel;
  assert.equal(result.createPaymentChannelRegistry().get("cash_xz_xts"), schema);
  assert.equal(schema.support.automation, "none");
  assert.deepEqual(result.validatePaymentChannelData(schema, {}).data, {});
  assert.deepEqual(result.renderDetailRows(schema, {}), []);
  assert.equal(
    JSON.parse(await readFile(path.join(directory, "contributing/evidence.json"), "utf8")).records[0].decision,
    "pending",
  );
});

test("second cash currency renames the source without changing the existing ID or export", async (t) => {
  const directory = await fixture(t);
  await scaffoldCashChannel(directory, { country: "XZ", currency: "XTS", evidence: research });
  await scaffoldCashChannel(directory, { country: "XZ", currency: "XXX", evidence: research });
  await assert.rejects(readFile(path.join(directory, "src/channels/xz/cash.ts")), { code: "ENOENT" });
  assert.match(await readFile(path.join(directory, "src/channels/xz/cash_xts.ts"), "utf8"), /id: "cash_xz_xts"/);
  const result = await compileAndInspect(directory);
  assert.deepEqual(
    result
      .listPaymentChannelSchemas(result.createPaymentChannelRegistry(), { country: "XZ" })
      .map((schema) => schema.id),
    ["cash_xz_xts", "cash_xz_xxx"],
  );
  assert.equal(result.cashXzXtsPaymentChannel.id, "cash_xz_xts");
  assert.equal(result.cashXzXxxPaymentChannel.id, "cash_xz_xxx");
});

test("invalid, duplicate, or structurally incompatible scaffold requests do not edit files", async (t) => {
  const directory = await fixture(t);
  const indexPath = path.join(directory, "src/channels/index.ts");
  const original = await readFile(indexPath, "utf8");
  await assert.rejects(
    scaffoldCashChannel(directory, { country: "../", currency: "XTS", evidence: research }),
    /uppercase/,
  );
  await assert.rejects(
    scaffoldCashChannel(directory, { country: "KE", currency: "KES", evidence: research }),
    /already exists/,
  );
  await assert.rejects(
    scaffoldCashChannel(directory, { country: "XZ", currency: "XTS", evidence: "file:///tmp/evidence" }),
    /HTTPS/,
  );
  assert.equal(await readFile(indexPath, "utf8"), original);
  const publicPath = path.join(directory, "src/index.ts");
  await writeFile(publicPath, "// deliberately incompatible export layout\n");
  await assert.rejects(
    scaffoldCashChannel(directory, { country: "XZ", currency: "XTS", evidence: research }),
    /public channel export block/,
  );
  assert.equal(await readFile(indexPath, "utf8"), original);
  await assert.rejects(readFile(path.join(directory, "src/channels/xz/cash.ts")), { code: "ENOENT" });
});

test("evidence decisions and local reviews require separate dated, linked evidence", async () => {
  const record = {
    channelId: "cash_xz_xts",
    country: "XZ",
    currency: "XTS",
    network: "cash",
    decision: "pending",
    decisionReference: null,
    sources: [],
    sourceCheckedOn: null,
    marketReview: null,
    trackingIssue: research,
    notes: "Fictional test fixture",
  };
  const check = (records) => validateEvidence({ version: 1, records }, []);
  assert.doesNotThrow(() => check([record]));
  assert.throws(() => check([record, record]), /duplicate/);
  assert.throws(() => check([{ ...record, decision: "accepted" }]), /dated sources/);
  assert.throws(() => check([{ ...record, sourceCheckedOn: "2026-99-99" }]), /invalid source-check date/);
  assert.throws(() => check([{ ...record, marketReview: { reviewer: "someone" } }]), /local review needs/);
  assert.doesNotThrow(() =>
    check([
      {
        ...record,
        decision: "accepted",
        decisionReference: research,
        sources: [{ url: research, supports: "Test claim" }],
        sourceCheckedOn: "2026-10-16",
      },
    ]),
  );
  assert.throws(
    () =>
      validateEvidence(
        {
          version: 1,
          records: [{ ...record, channelId: "cash_ke_kes", country: "KE", currency: "KES", network: "wrong" }],
        },
        builtinPaymentChannels,
      ),
    /metadata mismatch/,
  );
});

test("coverage shows missing evidence and unimplemented candidates without assigning review status", async (t) => {
  const directory = await fixture(t);
  await scaffoldCashChannel(directory, { country: "XZ", currency: "XTS", evidence: research });
  const [, markdown] = await contributionCoverageOutput(directory, builtinPaymentChannels);
  assert.match(markdown, /cash_xz_xts[^\n]*not implemented[^\n]*pending/);
  assert.match(markdown, /cash_ke_kes[^\n]*implemented[^\n]*not recorded/);
  assert.doesNotMatch(markdown, /expert verified/i);
});
