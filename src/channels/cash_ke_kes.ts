import {
  PaymentActor,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  definePaymentChannelSchema,
} from "../core.js";

export const cashKeKesPaymentChannel = definePaymentChannelSchema({
  id: "cash_ke_kes",
  version: 2,
  display: {
    label: "Cash",
    shortLabel: "Cash",
    description: "In-person cash settlement. Cash has no structured payment fields and is not automatable.",
    icon: "cash",
    group: PaymentChannelGroup.Cash,
  },
  network: { id: "cash", label: "Cash", country: "KE", currency: "KES" },
  support: {
    actors: [PaymentActor.Agent, PaymentActor.Customer],
    automation: PaymentChannelAutomation.None,
  },
  fields: [],
  detailRows: [],
  instructions: {
    payer: ["Exchange cash in person and keep local receipt evidence when required."],
  },
  evidence: [
    {
      key: "receiptNote",
      label: "Receipt note",
      type: PaymentFieldType.Text,
      required: false,
    },
  ],
});
