import assert from "node:assert/strict";

import {
  MaskingKind,
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  addPaymentChannelSchema,
  builtinPaymentChannels,
  createPaymentChannelRegistry,
  definePaymentChannelSchema,
  listPaymentChannelSchemas,
  renderDetailRows,
  validatePaymentChannelData,
} from "../dist/esm/index.js";

// Discover installed built-ins, then apply product-owned policy.
const registry = createPaymentChannelRegistry();
const approvedIds = new Set([builtinPaymentChannels[0].id]);
const market = builtinPaymentChannels[0].network;
const available = listPaymentChannelSchemas(registry, {
  country: market.country,
  currency: market.currency,
}).filter(({ id }) => approvedIds.has(id));
assert.equal(available.length, 1);

// XZ is a user-assigned country code and XTS is reserved for testing.
const exampleSchema = definePaymentChannelSchema({
  id: "example_wallet_xz_xts",
  version: 1,
  display: {
    label: "Example wallet",
    shortLabel: "Example",
    description: "Fictional wallet used for a market-neutral integration example.",
    icon: "wallet",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: {
    id: "example_wallet",
    label: "Example wallet",
    country: "XZ",
    currency: "XTS",
  },
  support: { automation: PaymentChannelAutomation.Manual },
  fields: [
    {
      key: "accountCode",
      label: "Account code",
      type: PaymentFieldType.Text,
      required: true,
      sensitive: true,
      mask: MaskingKind.Last4,
      normalize: [NormalizationKind.Trim, NormalizationKind.Uppercase],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^[A-Z]{2}-[0-9]{4}$",
          message: "Use two letters, a hyphen, and four digits",
        },
      ],
    },
  ],
  detailRows: [
    {
      key: "accountCode",
      label: "Account code",
      fields: ["accountCode"],
      copyable: true,
    },
  ],
});
addPaymentChannelSchema(registry, exampleSchema);

const controls = exampleSchema.fields.map(({ key, label, type, required, options = [] }) => ({
  key,
  label,
  type,
  required,
  options,
}));
assert.equal(controls.length, 1);

const invalid = validatePaymentChannelData(exampleSchema, {
  accountCode: "wrong",
});
assert.deepEqual(invalid.issues, [
  {
    field: "accountCode",
    message: "Use two letters, a hyphen, and four digits",
  },
]);

const valid = validatePaymentChannelData(exampleSchema, {
  accountCode: " ab-1234 ",
});
assert.deepEqual(valid, {
  valid: true,
  data: { accountCode: "AB-1234" },
  issues: [],
});
assert.deepEqual(renderDetailRows(exampleSchema, valid.data), [
  {
    key: "accountCode",
    label: "Account code",
    value: "***1234",
    copyable: true,
    copyValue: "AB-1234",
  },
]);

console.log("Generic consumer example passed.");
