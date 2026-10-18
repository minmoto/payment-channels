import {
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "../shared.js";

export const airtelMoneyPhoneTzTzsPaymentChannel = definePaymentChannelSchema({
  id: "airtel_money_phone_tz_tzs",
  version: 1,
  display: {
    label: "Airtel Money phone",
    shortLabel: "Airtel Money",
    description: "Airtel Money transfer to a Tanzanian phone number.",
    icon: "airtel-money",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "airtel_money", label: "Airtel Money", country: "TZ", currency: "TZS" },
  support: { automation: PaymentChannelAutomation.Manual },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+255 6XX XXX XXX or +255 7XX XXX XXX",
      helpText:
        "Airtel-assigned ranges include 0680–0689, 0690–0699, and 0780–0789 in domestic format. Prefixes are guidance only; number portability means they do not prove the current wallet provider.",
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
    payer: ["Send the exact amount to the displayed Airtel Money phone number."],
    payee: ["Confirm the Airtel Money transaction reference before marking the payment complete."],
  },
  evidence: mobileReferenceEvidence,
});
