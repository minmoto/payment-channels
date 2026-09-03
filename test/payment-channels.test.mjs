import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import * as paymentChannels from "../dist/index.js";
import {
  PaymentChannelAutomation,
  PaymentChannelGroup,
  builtinPaymentChannels,
  createPaymentChannelRegistry,
  definePaymentChannelSchema,
  listPaymentChannelSchemas,
  renderDetailRows,
  validatePaymentChannelData,
} from "../dist/index.js";

test("public contract excludes product workflow and actor metadata", () => {
  assert.equal("PaymentFlow" in paymentChannels, false);
  assert.equal("PaymentActor" in paymentChannels, false);
  for (const channel of builtinPaymentChannels) {
    assert.equal("flows" in channel.support, false);
    assert.equal("actors" in channel.support, false);
  }
});

test("registry exposes built-in KES mobile money channels", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "KES",
    country: "KE",
    group: PaymentChannelGroup.MobileMoney,
  });

  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["mpesa_phone_ke_kes", "mpesa_till_ke_kes", "mpesa_paybill_ke_kes", "airtel_money_ke_kes"],
  );
});

test("registry exposes the built-in ZAR PayShap bank channel", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "ZAR",
    country: "ZA",
    group: PaymentChannelGroup.Bank,
  });

  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["payshap_shapid_za_zar", "payshap_account_za_zar"],
  );
});

test("PayShap account details are normalized and required", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_account_za_zar");
  assert.ok(schema);

  const valid = validatePaymentChannelData(schema, {
    recipientName: " Jane Example ",
    bankName: " Example Bank ",
    accountNumber: " 1234567890 ",
    description: " settlement ",
  });

  assert.equal(valid.valid, true);
  assert.deepEqual(valid.data, {
    recipientName: "Jane Example",
    bankName: "Example Bank",
    accountNumber: "1234567890",
    description: "settlement",
  });

  const invalid = validatePaymentChannelData(schema, {
    recipientName: "Jane Example",
    bankName: " ",
    accountNumber: "1234567890",
  });

  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.issues, [{ field: "bankName", message: "Bank is required" }]);
});

test("PayShap account details render with a masked copyable account number", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_account_za_zar");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    recipientName: "Jane Example",
    bankName: "Example Bank",
    accountNumber: "1234567890",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "recipientName",
      label: "Recipient name",
      value: "Jane Example",
      copyable: false,
    },
    {
      key: "bankName",
      label: "Bank",
      value: "Example Bank",
      copyable: false,
    },
    {
      key: "accountNumber",
      label: "Account number",
      value: "******7890",
      copyable: true,
      copyValue: "1234567890",
    },
  ]);
});

test("PayShap trims and validates bank-qualified ShapIDs", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_shapid_za_zar");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    shapId: " 0812345678@standardbank ",
    description: " settlement ",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.shapId, "0812345678@standardbank");
  assert.equal(result.data.description, "settlement");
});

test("PayShap rejects invalid ShapIDs", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_shapid_za_zar");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    shapId: "not-a-shapid",
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.issues, [
    {
      field: "shapId",
      message: "Use a South African cellphone ShapID, e.g. 0812345678 or 0812345678@bank",
    },
  ]);
});

test("PayShap detail rows mask display values while preserving the full copy value", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_shapid_za_zar");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    shapId: "0812345678@standardbank",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "shapId",
      label: "ShapID",
      value: "0812***678@standardbank",
      copyable: true,
      copyValue: "0812345678@standardbank",
    },
  ]);
});

test("phone fields normalize and validate against currency network rules", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone_ke_kes");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
    description: " settlement ",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.phoneNumber, "+254712345678");
  assert.equal(result.data.description, "settlement");
});

test("phone fields normalize international dialing prefixes", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone_ke_kes");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "00254 712 345 678",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.phoneNumber, "+254712345678");
});

test("invalid channel data returns field issues", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "tnm_mpamba_mw_mwk");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "+265991234567",
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.issues, [
    {
      field: "phoneNumber",
      message: "Use a TNM Malawi number, e.g. +265881234567",
    },
  ]);
});

test("detail rows mask display values while preserving copy values", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone_ke_kes");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "phoneNumber",
      label: "Phone number",
      value: "+254***678",
      copyable: true,
      copyValue: "+254712345678",
    },
  ]);
});

test("detail rows render copyable values from validated data", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_paybill_ke_kes");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    paybillNumber: "123456",
    accountNumber: "ORDER-42",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "paybillNumber",
      label: "Paybill number",
      value: "123456",
      copyable: true,
      copyValue: "123456",
    },
    {
      key: "accountNumber",
      label: "Account number",
      value: "ORDER-42",
      copyable: true,
      copyValue: "ORDER-42",
    },
  ]);
});

test("cash is present but explicitly not automated", () => {
  const cash = builtinPaymentChannels.find((channel) => channel.id === "cash_ke_kes");
  assert.ok(cash);
  assert.equal(cash.display.group, PaymentChannelGroup.Cash);
  assert.equal(cash.support.automation, PaymentChannelAutomation.None);
  assert.deepEqual(cash.fields, []);
});

test("channel source files contain one channel matching the filename", async () => {
  const channelsDirectory = fileURLToPath(new URL("../src/channels", import.meta.url));
  const filenames = (await readdir(channelsDirectory)).filter(
    (filename) => filename.endsWith(".ts") && filename !== "index.ts" && filename !== "shared.ts",
  );

  assert.ok(filenames.length > 0);

  for (const filename of filenames) {
    const source = await readFile(path.join(channelsDirectory, filename), "utf8");
    const definitions = source.match(/definePaymentChannelSchema\(\{/g) ?? [];
    const exports = [...source.matchAll(/^export\s+const\s+(\w+)\s*=\s*definePaymentChannelSchema\(\{\s*id:\s*"([^"]+)"/gm)];

    assert.equal(definitions.length, 1, `${filename} must define exactly one payment channel`);
    assert.equal(exports.length, 1, `${filename} must export its payment channel definition`);
    assert.equal(filename, `${exports[0][2]}.ts`, `${filename} must match channel id ${exports[0][2]}`);
  }
});

test("schema definitions reject unsafe registry entries early", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: "broken",
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: { id: "broken", label: "Broken", country: "KE", currency: "KES" },
        support: {
          automation: PaymentChannelAutomation.Manual,
        },
        fields: [
          {
            key: "account",
            label: "Account",
            type: "text",
            required: true,
            validation: [{ kind: "pattern", pattern: "[" }],
          },
        ],
        detailRows: [],
      }),
    /Invalid validation pattern/,
  );
});

test("schema definitions reject invalid automation values early", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: "broken_automation",
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: { id: "broken", label: "Broken", country: "KE", currency: "KES" },
        support: {
          automation: /** @type {any} */ ("script"),
        },
        fields: [],
        detailRows: [],
      }),
    /Payment channel automation is invalid/,
  );
});

test("schema definitions reject missing detail rows early", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema(
        /** @type {any} */ ({
          id: "missing_detail_rows",
          version: 1,
          display: {
            label: "Broken",
            shortLabel: "Broken",
            description: "Invalid schema",
            icon: "broken",
            group: PaymentChannelGroup.MobileMoney,
          },
          network: { id: "broken", label: "Broken", country: "KE", currency: "KES" },
          support: {
            automation: PaymentChannelAutomation.Manual,
          },
          fields: [],
        }),
      ),
    /Payment channel schema missing detailRows/,
  );
});

test("schema definitions reject non-canonical channel identifiers", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: /** @type {any} */ ("Mpesa"),
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: { id: "broken", label: "Broken", country: /** @type {any} */ ("ke"), currency: "KES" },
        support: {
          automation: PaymentChannelAutomation.Manual,
        },
        fields: [],
        detailRows: [],
      }),
    /Payment channel schema id must be lowercase snake case/,
  );
});

test("schema definitions reject duplicate detail row keys", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: "duplicate_detail_rows",
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: { id: "broken", label: "Broken", country: "KE", currency: "KES" },
        support: {
          automation: PaymentChannelAutomation.Manual,
        },
        fields: [
          {
            key: "account",
            label: "Account",
            type: "text",
            required: true,
          },
        ],
        detailRows: [
          { key: "account", label: "Account", fields: ["account"] },
          { key: "account", label: "Account copy", fields: ["account"] },
        ],
      }),
    /Duplicate detail row key/,
  );
});
