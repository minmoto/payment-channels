import {
  MaskingKind,
  NormalizationKind,
  PaymentChannelField,
  PaymentFieldType,
  ValidationRuleKind,
  type EvidenceField,
} from "../core.js";

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
