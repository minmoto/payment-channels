import {
  PaymentChannelAutomation,
  PaymentChannelGroup,
  MaskingKind,
  NormalizationKind,
  PaymentChannelField,
  PaymentFieldType,
  definePaymentChannelSchema,
  ValidationRuleKind,
  type EvidenceField,
  type CountryCode,
  type CurrencyCode,
  type PaymentChannelId,
  type PaymentChannelSchema,
} from "../core.js";

export const cashChannelDefinition = {
  display: {
    label: "Cash",
    shortLabel: "Cash",
    description: "In-person cash settlement. Cash has no structured payment fields and is not automatable.",
    icon: "cash",
    group: PaymentChannelGroup.Cash,
  },
  support: {
    automation: PaymentChannelAutomation.None,
  },
  fields: [],
  detailRows: [],
  instructions: {
    payer: ["Exchange cash in person and keep local receipt evidence when required."],
  },
  evidence: [
    {
      key: "receiptNote",
      label: "Receipt note",
      type: PaymentFieldType.Text,
      required: false,
    },
  ],
} satisfies Pick<PaymentChannelSchema, "display" | "support" | "fields" | "detailRows" | "instructions" | "evidence">;

export function createCashPaymentChannel(input: {
  id: PaymentChannelId;
  country: CountryCode;
  currency: CurrencyCode;
}): PaymentChannelSchema {
  return definePaymentChannelSchema({
    id: input.id,
    version: 2,
    ...cashChannelDefinition,
    network: {
      id: "cash",
      label: "Cash",
      country: input.country,
      currency: input.currency,
    },
  });
}

export const phoneNumberField: PaymentChannelField = {
  key: "phoneNumber",
  label: "Phone number",
  type: PaymentFieldType.Phone,
  required: true,
  sensitive: true,
  mask: MaskingKind.Phone,
  normalize: [NormalizationKind.Trim],
};

export const descriptionField: PaymentChannelField = {
  key: "description",
  label: "Description",
  type: PaymentFieldType.Text,
  required: false,
  normalize: [NormalizationKind.Trim],
  validation: [{ kind: ValidationRuleKind.MaxLength, length: 100 }],
};

export const mobileReferenceEvidence: readonly EvidenceField[] = [
  {
    key: "transactionReference",
    label: "Transaction reference",
    type: PaymentFieldType.Text,
    required: true,
    validation: [{ kind: ValidationRuleKind.MinLength, length: 3 }],
  },
];
