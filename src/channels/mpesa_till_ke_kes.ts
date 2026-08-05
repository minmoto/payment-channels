import {
  NormalizationKind,
  PaymentActor,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  PaymentFlow,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../core.js";
import { descriptionField, mobileReferenceEvidence } from "./shared.js";

export const mpesaTillKeKesPaymentChannel = definePaymentChannelSchema({
  id: "mpesa_till_ke_kes",
  version: 1,
  display: {
    label: "M-Pesa till",
    shortLabel: "Till",
    description: "Safaricom M-Pesa Buy Goods till payment.",
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
      key: "tillNumber",
      label: "Till number",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "123456",
      normalize: [NormalizationKind.Trim, NormalizationKind.DigitsOnly],
      validation: [
        { kind: ValidationRuleKind.Pattern, pattern: "^\\d{5,7}$", message: "Use a 5-7 digit till number" },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "tillNumber", label: "Till number", fields: ["tillNumber"], copyable: true }],
  evidence: mobileReferenceEvidence,
});
