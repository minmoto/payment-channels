import { readFile } from "node:fs/promises";
import path from "node:path";
import { format } from "prettier";
import prettierConfig from "../.prettierrc.mjs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
function isDate(value) {
  return (
    typeof value === "string" &&
    datePattern.test(value) &&
    Number.isFinite(new Date(value).getTime()) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
function isUrl(value) {
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
function requireValue(condition, message) {
  if (!condition) throw new Error(`Contribution evidence: ${message}`);
}

export function validateEvidence(data, channels) {
  requireValue(data?.version === 1 && Array.isArray(data.records), "expected version 1 and a records array");
  const seen = new Set();
  const registry = new Map(channels.map((channel) => [channel.id, channel]));
  for (const record of data.records) {
    const id = record.channelId;
    requireValue(typeof id === "string" && /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(id), "invalid channel ID");
    requireValue(!seen.has(id), `duplicate record ${id}`);
    seen.add(id);
    requireValue(
      /^[A-Z]{2}$/.test(record.country) && /^[A-Z]{3}$/.test(record.currency),
      `${id}: invalid market codes`,
    );
    requireValue(
      typeof record.network === "string" && /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(record.network),
      `${id}: invalid network`,
    );
    requireValue(
      id.endsWith(`_${record.country.toLowerCase()}_${record.currency.toLowerCase()}`),
      `${id}: market suffix mismatch`,
    );
    const schema = registry.get(id);
    if (schema) {
      requireValue(
        ["country", "currency"].every((key) => schema.network[key] === record[key]) &&
          schema.network.id === record.network,
        `${id}: registry metadata mismatch`,
      );
    }
    requireValue(["pending", "accepted", "excluded"].includes(record.decision), `${id}: invalid decision`);
    requireValue(isUrl(record.trackingIssue), `${id}: missing tracking issue`);
    requireValue(
      Array.isArray(record.sources) &&
        record.sources.every(
          (source) => isUrl(source.url) && typeof source.supports === "string" && source.supports.trim(),
        ),
      `${id}: sources need URLs and supported claims`,
    );
    requireValue(record.sourceCheckedOn === null || isDate(record.sourceCheckedOn), `${id}: invalid source-check date`);
    requireValue(
      record.decisionReference === null || isUrl(record.decisionReference),
      `${id}: invalid decision reference`,
    );
    if (record.decision !== "pending") {
      requireValue(
        record.sources.length > 0 && isDate(record.sourceCheckedOn) && isUrl(record.decisionReference),
        `${id}: accepted/excluded decisions need dated sources and a linked decision`,
      );
    }
    requireValue(typeof record.notes === "string", `${id}: notes must be text`);
    const review = record.marketReview;
    requireValue(
      review === null ||
        (review &&
          ["reviewer", "experience", "scope"].every((key) => typeof review[key] === "string" && review[key].trim()) &&
          isDate(review.reviewedOn) &&
          isUrl(review.reference)),
      `${id}: local review needs reviewer, experience, scope, date, and reference`,
    );
  }
  return data.records;
}

function cell(value) {
  return String(value)
    .replace(/[\r\n]+/g, " ")
    .replaceAll("|", "\\|")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function contributionCoverageOutput(root, channels) {
  const data = JSON.parse(await readFile(path.join(root, "contributing/evidence.json"), "utf8"));
  const records = validateEvidence(data, channels);
  const evidence = new Map(records.map((record) => [record.channelId, record]));
  const registry = new Map(channels.map((schema) => [schema.id, schema]));
  const ids = [...new Set([...registry.keys(), ...evidence.keys()])].sort();
  const rows = ids.map((id) => {
    const schema = registry.get(id);
    const record = evidence.get(id);
    const market = schema?.network ?? record;
    const implementation = schema
      ? record?.decision === "excluded"
        ? "implemented; exclusion unresolved"
        : "implemented"
      : "not implemented";
    const sources =
      record?.sources.map((source, index) => `[${index + 1}](${source.url})`).join(", ") || "not recorded";
    const review = record?.marketReview;
    return `| ${cell(id)} | ${cell(market.country)} | ${cell(market.currency)} | ${cell(schema?.network.id ?? record.network)} | ${implementation} | ${record?.decision ?? "not recorded"} | ${sources} | ${record?.sourceCheckedOn ?? "not recorded"} | ${review ? `${cell(review.reviewer)}; ${review.reviewedOn} ([scope](${review.reference}))` : "not recorded"} | ${record ? `[task](${record.trackingIssue})` : "not recorded"} |`;
  });
  const content = await format(
    `# Coverage and evidence\n\n> Generated by \`npm run docs:generate\` from \`builtinPaymentChannels\` and [evidence.json](evidence.json). Do not edit this file directly.\n\nThis is an implemented inventory joined with recorded research candidates, not an exhaustive global market matrix. A missing row is not an exclusion. Implementation, source acceptance, and local review are separate; existing channels without evidence records remain explicitly unreviewed here. These contributor records do not change runtime behavior or establish provider capability. See the [review guide](review-guide.md) for decision criteria, review scope, and how to add records.\n\nSource links support the claims described in the JSON record; a link alone does not mean a source was checked. Dates are recorded verification dates, never generator timestamps. Accepted but unimplemented rows need implementation; excluded but implemented rows need a compatibility decision.\n\n| Channel ID | Country | Currency | Network | Implementation | Evidence decision | Sources | Sources checked | Local review | Tracking |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.join("\n")}\n`,
    { ...prettierConfig, parser: "markdown" },
  );
  return [path.join(root, "contributing/coverage.md"), content];
}
