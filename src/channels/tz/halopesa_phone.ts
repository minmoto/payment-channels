import {
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "../shared.js";

export const halopesaPhoneTzTzsPaymentChannel = definePaymentChannelSchema({
  id: "halopesa_phone_tz_tzs",
  version: 1,
  display: {
    label: "HaloPesa phone",
    shortLabel: "HaloPesa",
    description: "HaloPesa mobile-money transfer to a Tanzanian phone number.",
    icon: "halopesa",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "halopesa", label: "HaloPesa", country: "TZ", currency: "TZS" },
  support: { automation: PaymentChannelAutomation.Manual },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+255 61X XXX XXX",
      helpText:
        "The operational Halotel-assigned range is 0610–0619 in domestic format. TCRA lists 062 as not operational. Prefixes are guidance only; number portability means they do not prove the current wallet provider. See the Tanzania prefix reference in the package docs.",
      normalize: [NormalizationKind.Trim, NormalizationKind.E164TanzaniaPhone],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^\\+255[67][0-9]{8}$",
          message: "Use a Tanzanian mobile number in international format, e.g. +255 61X XXX XXX",
        },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
  instructions: {
    payer: ["Send the exact amount to the displayed HaloPesa phone number."],
    payee: ["Confirm the HaloPesa transaction reference before marking the payment complete."],
  },
  evidence: mobileReferenceEvidence,
});
