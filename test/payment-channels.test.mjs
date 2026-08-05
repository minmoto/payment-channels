import assert from "node:assert/strict";
import test from "node:test";

import {
  PaymentActor,
  PaymentFlow,
  PaymentChannelGroup,
  builtinPaymentChannels,
  createPaymentChannelRegistry,
  definePaymentChannelSchema,
  listPaymentChannelSchemas,
  renderDetailRows,
  validatePaymentChannelData,
} from "../dist/index.js";

test("registry exposes built-in KES mobile money channels", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "KES",
    country: "KE",
    group: PaymentChannelGroup.MobileMoney,
    flow: PaymentFlow.Offramp,
    actor: PaymentActor.Agent,
  });

  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["mpesa_phone", "mpesa_till", "mpesa_paybill", "airtel_money"],
  );
});

test("phone fields normalize and validate against currency network rules", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
    description: " settlement ",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.phoneNumber, "+254712345678");
  assert.equal(result.data.description, "settlement");
});

test("invalid channel data returns field issues", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "tnm_mpamba");
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

test("detail rows render copyable values from validated data", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_paybill");
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
  const cash = builtinPaymentChannels.find((channel) => channel.id === "cash");
  assert.ok(cash);
  assert.equal(cash.display.group, PaymentChannelGroup.Cash);
  assert.equal(cash.support.automatedPayout, false);
  assert.deepEqual(cash.fields, []);
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
        support: { flows: [PaymentFlow.Offramp], actors: [PaymentActor.Agent], automatedPayout: false },
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
