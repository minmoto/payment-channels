import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { format } from "prettier";
import prettierConfig from "../.prettierrc.mjs";
import { validateEvidence } from "./contribution-coverage.mjs";

async function readOptional(filename) {
  try {
    return await readFile(filename, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return null;
  }
}

function replaceOnce(source, pattern, replacement, description) {
  let matches = 0;
  const result = source.replace(pattern, (...args) => {
    matches += 1;
    return replacement(...args);
  });
  if (matches !== 1) throw new Error(`Cannot locate exactly one ${description}; no files changed.`);
  return result;
}

export async function scaffoldCashChannel(root, { country, currency, evidence }) {
  if (!/^[A-Z]{2}$/.test(country ?? "") || !/^[A-Z]{3}$/.test(currency ?? "")) {
    throw new Error("Use uppercase country (2 letters) and currency (3 letters) codes from accepted research.");
  }
  let evidenceUrl;
  try {
    evidenceUrl = new URL(evidence);
  } catch {
    throw new Error("--evidence must link to the research issue or PR.");
  }
  if (evidenceUrl.protocol !== "https:") throw new Error("--evidence must be an HTTPS research issue or PR URL.");
  const cc = country.toLowerCase();
  const cy = currency.toLowerCase();
  const id = `cash_${cc}_${cy}`;
  const symbol = `cash${country[0]}${cc.slice(1)}${currency[0]}${cy.slice(1)}PaymentChannel`;
  const indexPath = path.join(root, "src/channels/index.ts");
  const publicPath = path.join(root, "src/index.ts");
  const testPath = path.join(root, "test/payment-channels.test.mjs");
  const evidencePath = path.join(root, "contributing/evidence.json");
  let index = await readFile(indexPath, "utf8");
  let publicIndex = await readFile(publicPath, "utf8");
  let tests = await readFile(testPath, "utf8");
  const evidenceData = JSON.parse(await readFile(evidencePath, "utf8"));
  validateEvidence(evidenceData, []);
  const directory = path.join(root, "src/channels", cc);
  let filenames;
  try {
    filenames = await readdir(directory);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    filenames = [];
  }
  const cashFiles = filenames.filter((name) => /^cash(?:_[a-z]{3})?\.ts$/.test(name));
  for (const name of cashFiles) {
    const source = await readFile(path.join(directory, name), "utf8");
    if (source.includes(`"${id}"`)) throw new Error(`${id} already exists; no files changed.`);
  }
  if (index.includes(symbol) || publicIndex.includes(symbol) || tests.includes(`"${id}"`)) {
    throw new Error(`${id} is already referenced; resolve the existing work first. No files changed.`);
  }
  const edits = new Map();
  let remove = null;
  if (cashFiles.includes("cash.ts")) {
    const oldPath = path.join(directory, "cash.ts");
    const source = await readFile(oldPath, "utf8");
    const oldCurrency = source.match(/currency:\s*"([A-Z]{3})"/)?.[1]?.toLowerCase();
    if (!oldCurrency) throw new Error("Cannot identify existing cash currency; no files changed.");
    const renamed = path.join(directory, `cash_${oldCurrency}.ts`);
    if ((await readOptional(renamed)) !== null)
      throw new Error("Existing qualified cash filename would be overwritten; no files changed.");
    edits.set(renamed, source);
    const oldImport = `"./${cc}/cash.js"`;
    if (!index.includes(oldImport)) throw new Error("Existing cash export/import path is missing; no files changed.");
    index = index.replaceAll(oldImport, `"./${cc}/cash_${oldCurrency}.js"`);
    remove = oldPath;
  }
  const filename = cashFiles.length ? `cash_${cy}.ts` : "cash.ts";
  const sourcePath = path.join(directory, filename);
  if ((await readOptional(sourcePath)) !== null && sourcePath !== remove)
    throw new Error("Channel filename exists; no files changed.");
  edits.set(
    sourcePath,
    `import { createCashPaymentChannel } from "../shared.js";\n\nexport const ${symbol} = createCashPaymentChannel({ id: "${id}", country: "${country}", currency: "${currency}" });\n`,
  );
  const modulePath = `./${cc}/${filename.replace(/\.ts$/, ".js")}`;
  index = `export { ${symbol} } from "${modulePath}";\nimport { ${symbol} } from "${modulePath}";\n${index}`;
  index = replaceOnce(
    index,
    /(export const builtinPaymentChannels: readonly PaymentChannelSchema\[\] = \[[\s\S]*?)\n\];/g,
    (_, body) => `${body}\n  ${symbol},\n];`,
    "built-in registry array",
  );
  publicIndex = replaceOnce(
    publicIndex,
    /(export \{[^}]*)(\} from "\.\/channels\/index\.js";)/g,
    (_, body, end) => `${body}  ${symbol},\n${end}`,
    "public channel export block",
  );
  tests = replaceOnce(
    tests,
    /(test\("every represented country has a built-in cash channel",[\s\S]*?)(    \],\n  \);\n\}\);)/g,
    (_, body, end) => `${body}      "${id}",\n${end}`,
    "cash inventory assertion",
  );
  tests += `\n test("${id} is discoverable and keeps the cash contract", () => {
    const registry = createPaymentChannelRegistry();
    const schema = registry.get("${id}");
    assert.ok(schema);
    assert.deepEqual(listPaymentChannelSchemas(registry, { country: "${country}", currency: "${currency}", group: PaymentChannelGroup.Cash }).map((channel) => channel.id), ["${id}"]);
    assert.equal(paymentChannels.${symbol}, schema);
    assert.equal(schema.version, 2);
    assert.equal(schema.support.automation, PaymentChannelAutomation.None);
    assert.deepEqual(schema.fields, []);
    const result = validatePaymentChannelData(schema, {});
    assert.equal(result.valid, true);
    assert.deepEqual(result.data, {});
    assert.deepEqual(renderDetailRows(schema, result.data), []);
  });\n`;
  const existingRecord = evidenceData.records.find((record) => record.channelId === id);
  if (
    existingRecord &&
    (existingRecord.country !== country || existingRecord.currency !== currency || existingRecord.network !== "cash")
  ) {
    throw new Error("Evidence record conflicts with the proposed channel; no files changed.");
  }
  if (!existingRecord)
    evidenceData.records.push({
      channelId: id,
      country,
      currency,
      network: "cash",
      decision: "pending",
      decisionReference: null,
      sources: [],
      sourceCheckedOn: null,
      marketReview: null,
      trackingIssue: evidenceUrl.href,
      notes: "Scaffolded from a research link. Record source acceptance and any required market review separately.",
    });
  edits.set(indexPath, index);
  edits.set(publicPath, publicIndex);
  edits.set(testPath, tests);
  edits.set(evidencePath, JSON.stringify(evidenceData));
  // Prepare every edit before writing, so invalid input or changed source anchors fail without partial edits.
  for (const [filename, source] of edits) {
    edits.set(
      filename,
      await format(source, {
        ...prettierConfig,
        parser: filename.endsWith(".json") ? "json" : filename.endsWith(".ts") ? "typescript" : "babel",
      }),
    );
  }
  for (const [filename, source] of edits) {
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, source);
  }
  if (remove) await unlink(remove);
  return { id, files: [...edits.keys(), ...(remove ? [remove] : [])].map((filename) => path.relative(root, filename)) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({
      options: {
        country: { type: "string" },
        currency: { type: "string" },
        evidence: { type: "string" },
        help: { type: "boolean" },
      },
    });
    if (values.help) {
      console.log(
        "Usage: npm run channel:scaffold:cash -- --country XX --currency XXX --evidence https://...\nUse accepted research. This tool does not determine currency coverage or approve evidence.",
      );
    } else {
      const result = await scaffoldCashChannel(
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
        values,
      );
      console.log(
        `Scaffolded ${result.id}:\n${result.files.join("\n")}\nInspect the diff, complete the evidence record, then run docs:generate, format, check, pack --dry-run, and verify:pack.`,
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
