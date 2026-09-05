import {
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "../shared.js";

export const airtelMoneyKeKesPaymentChannel = definePaymentChannelSchema({
  id: "airtel_money_ke_kes",
  version: 2,
  display: {
    label: "Airtel Money",
    shortLabel: "Airtel",
    description: "Airtel Money wallet transfer to a phone number.",
    icon: "airtel-money",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "airtel_money", label: "Airtel Money", country: "KE", currency: "KES" },
  support: {
    automation: PaymentChannelAutomation.Api,
  },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+254712345678",
      normalize: [NormalizationKind.Trim, NormalizationKind.E164KenyaPhone],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^\\+254[0-9]{9}$",
          message: "Use a Kenyan phone number in international format, e.g. +254712345678",
        },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
  evidence: mobileReferenceEvidence,
});
