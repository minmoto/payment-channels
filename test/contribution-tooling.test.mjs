import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { builtinPaymentChannels } from "../dist/esm/index.js";
import { contributionCoverageOutput, validateEvidence } from "../scripts/contribution-coverage.mjs";

const research = "https://github.com/minmoto/payment-channels/issues/123";
const candidate = {
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

test("evidence decisions and local reviews require separate dated, linked evidence", async () => {
  const record = candidate;
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
  const directory = await mkdtemp(path.join(os.tmpdir(), "payment-channel-contribution-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, "contributing"));
  await writeFile(
    path.join(directory, "contributing/evidence.json"),
    JSON.stringify({ version: 1, records: [candidate] }),
  );
  const [, markdown] = await contributionCoverageOutput(directory, builtinPaymentChannels);
  assert.match(markdown, /cash_xz_xts[^\n]*not implemented[^\n]*pending/);
  assert.match(markdown, /cash_ke_kes[^\n]*implemented[^\n]*not recorded/);
  assert.doesNotMatch(markdown, /expert verified/i);
});
