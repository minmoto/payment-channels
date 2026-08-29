import {
  NormalizationKind,
  PaymentActor,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../core.js";
import { descriptionField, mobileReferenceEvidence } from "./shared.js";

export const mpesaPaybillKeKesPaymentChannel = definePaymentChannelSchema({
  id: "mpesa_paybill_ke_kes",
  version: 2,
  display: {
    label: "M-Pesa paybill",
    shortLabel: "Paybill",
    description: "Safaricom M-Pesa Pay Bill payment with an account reference.",
    icon: "mpesa",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "mpesa", label: "M-Pesa", country: "KE", currency: "KES" },
  support: {
    actors: [PaymentActor.Agent, PaymentActor.Customer],
    automation: PaymentChannelAutomation.Api,
  },
  fields: [
    {
      key: "paybillNumber",
      label: "Paybill number",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "123456",
      normalize: [NormalizationKind.Trim, NormalizationKind.DigitsOnly],
      validation: [
        { kind: ValidationRuleKind.Pattern, pattern: "^\\d{5,7}$", message: "Use a 5-7 digit paybill number" },
      ],
    },
    {
      key: "accountNumber",
      label: "Account number",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "Account reference",
      normalize: [NormalizationKind.Trim],
      validation: [
        { kind: ValidationRuleKind.MinLength, length: 1 },
        { kind: ValidationRuleKind.MaxLength, length: 20 },
      ],
    },
    descriptionField,
  ],
  detailRows: [
    { key: "paybillNumber", label: "Paybill number", fields: ["paybillNumber"], copyable: true },
    { key: "accountNumber", label: "Account number", fields: ["accountNumber"], copyable: true },
  ],
  evidence: mobileReferenceEvidence,
});
