import {
  NormalizationKind,
  PaymentActor,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFlow,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../core.js";
import { descriptionField, mobileReferenceEvidence, phoneNumberField } from "./shared.js";

export const mpesaPhoneKeKesPaymentChannel = definePaymentChannelSchema({
  id: "mpesa_phone_ke_kes",
  version: 1,
  display: {
    label: "M-Pesa phone",
    shortLabel: "M-Pesa",
    description: "Safaricom M-Pesa wallet transfer to a Kenyan phone number.",
    icon: "mpesa",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "mpesa", label: "M-Pesa", country: "KE", currency: "KES" },
  support: {
    flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
    actors: [PaymentActor.Agent, PaymentActor.Customer],
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
  instructions: {
    payer: ["Send the exact amount to the displayed M-Pesa phone number."],
    payee: ["Confirm the M-Pesa reference is available if the payment is disputed."],
  },
  evidence: mobileReferenceEvidence,
});
