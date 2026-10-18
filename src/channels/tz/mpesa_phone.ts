import {
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "../shared.js";

export const mpesaPhoneTzTzsPaymentChannel = definePaymentChannelSchema({
  id: "mpesa_phone_tz_tzs",
  version: 1,
  display: {
    label: "M-Pesa phone",
    shortLabel: "M-Pesa",
    description: "M-Pesa mobile-money transfer to a Tanzanian phone number.",
    icon: "mpesa",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "mpesa", label: "M-Pesa", country: "TZ", currency: "TZS" },
  support: { automation: PaymentChannelAutomation.Manual },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+255 7XX XXX XXX",
      helpText:
        "Vodacom-assigned ranges include 0740–0749, 0750–0759, 0760–0769, and 0790–0799 in domestic format. Prefixes are guidance only; number portability means they do not prove the current wallet provider.",
      normalize: [NormalizationKind.Trim, NormalizationKind.E164TanzaniaPhone],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^\\+255[67][0-9]{8}$",
          message: "Use a Tanzanian mobile number in international format, e.g. +255 7XX XXX XXX",
        },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
  instructions: {
    payer: ["Send the exact amount to the displayed M-Pesa phone number."],
    payee: ["Confirm the M-Pesa transaction reference before marking the payment complete."],
  },
  evidence: mobileReferenceEvidence,
});
