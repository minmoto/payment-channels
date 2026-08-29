import {
  NormalizationKind,
  PaymentActor,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "./shared.js";

export const airtelMoneyMwMwkPaymentChannel = definePaymentChannelSchema({
  id: "airtel_money_mw_mwk",
  version: 2,
  display: {
    label: "Airtel Money Malawi",
    shortLabel: "Airtel MW",
    description: "Airtel Money Malawi wallet transfer to an Airtel phone number.",
    icon: "airtel-money",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "airtel_money", label: "Airtel Money", country: "MW", currency: "MWK" },
  support: {
    actors: [PaymentActor.Agent, PaymentActor.Customer],
    automation: PaymentChannelAutomation.Api,
  },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+265991234567",
      normalize: [NormalizationKind.Trim, NormalizationKind.E164MalawiPhone],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^\\+2659[89][0-9]{7}$",
          message: "Use an Airtel Malawi number, e.g. +265991234567",
        },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
  evidence: mobileReferenceEvidence,
});
