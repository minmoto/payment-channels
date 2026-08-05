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

export const tnmMpambaMwMwkPaymentChannel = definePaymentChannelSchema({
  id: "tnm_mpamba_mw_mwk",
  version: 1,
  display: {
    label: "TNM Mpamba",
    shortLabel: "Mpamba",
    description: "TNM Mpamba wallet transfer to a TNM phone number.",
    icon: "tnm-mpamba",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: { id: "tnm_mpamba", label: "TNM Mpamba", country: "MW", currency: "MWK" },
  support: {
    flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
    actors: [PaymentActor.Agent, PaymentActor.Customer],
    automation: PaymentChannelAutomation.Api,
  },
  fields: [
    {
      ...phoneNumberField,
      placeholder: "+265881234567",
      normalize: [NormalizationKind.Trim, NormalizationKind.E164MalawiPhone],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^\\+2658[48][0-9]{7}$",
          message: "Use a TNM Malawi number, e.g. +265881234567",
        },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
  evidence: mobileReferenceEvidence,
});
