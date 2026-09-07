import {
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "../shared.js";

export const mpesaPochiKeKesPaymentChannel = definePaymentChannelSchema({
  id: "mpesa_pochi_ke_kes",
  version: 2,
  display: {
    label: "M-Pesa Pochi la Biashara",
    shortLabel: "Pochi",
    description: "Safaricom M-Pesa payment to a Pochi la Biashara business phone number.",
    icon: "mpesa",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "mpesa", label: "M-Pesa", country: "KE", currency: "KES" },
  support: {
    automation: PaymentChannelAutomation.Manual,
  },
  fields: [
    {
      ...phoneNumberField,
      label: "Business phone number",
      placeholder: "+254712345678",
      helpText: "Use the phone number registered for Pochi la Biashara.",
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
  detailRows: [
    { key: "phoneNumber", label: "Business phone number", fields: ["phoneNumber"], copyable: true },
  ],
  instructions: {
    payer: ["Send the exact amount using M-Pesa Pochi la Biashara to the displayed business phone number."],
    payee: ["Confirm the M-Pesa reference is available if the payment is disputed."],
  },
  evidence: mobileReferenceEvidence,
});
