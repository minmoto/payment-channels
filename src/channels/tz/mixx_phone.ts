import {
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "../shared.js";

export const mixxPhoneTzTzsPaymentChannel = definePaymentChannelSchema({
  id: "mixx_phone_tz_tzs",
  version: 1,
  display: {
    label: "Mixx by Yas phone",
    shortLabel: "Mixx by Yas",
    description: "Mixx by Yas mobile-money transfer to a Tanzanian phone number; formerly Tigo Pesa.",
    icon: "mixx-by-yas",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "mixx_by_yas", label: "Mixx by Yas", country: "TZ", currency: "TZS" },
  support: { automation: PaymentChannelAutomation.Manual },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+255 6XX XXX XXX or +255 7XX XXX XXX",
      helpText:
        "Yas-assigned ranges include 0650–0659, 0670–0679, 0710–0719, and 0770–0779 in domestic format. Tigo Pesa is the former service name. Prefixes are guidance only; number portability means they do not prove the current wallet provider. See the Tanzania prefix reference in the package docs.",
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
    payer: ["Send the exact amount to the displayed Mixx by Yas phone number."],
    payee: ["Confirm the Mixx by Yas transaction reference before marking the payment complete."],
  },
  evidence: mobileReferenceEvidence,
});
