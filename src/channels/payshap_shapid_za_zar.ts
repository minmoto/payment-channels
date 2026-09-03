import {
  MaskingKind,
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../core.js";
import { descriptionField } from "./shared.js";

export const payshapShapidZaZarPaymentChannel = definePaymentChannelSchema({
  id: "payshap_shapid_za_zar",
  version: 1,
  display: {
    label: "PayShap ShapID",
    shortLabel: "PayShap",
    description: "South African real-time bank transfer to a registered PayShap ShapID.",
    icon: "payshap",
    group: PaymentChannelGroup.Bank,
  },
  network: { id: "payshap", label: "PayShap", country: "ZA", currency: "ZAR" },
  support: {
    automation: PaymentChannelAutomation.Manual,
  },
  fields: [
    {
      key: "shapId",
      label: "ShapID",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "0812345678@standardbank",
      helpText: "Use the recipient's registered cellphone number, optionally followed by @bank.",
      sensitive: true,
      mask: MaskingKind.ShapId,
      normalize: [NormalizationKind.Trim],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^(?:0[0-9]{9}|\\+27[0-9]{9})(?:@[A-Za-z0-9]+)?$",
          message: "Use a South African cellphone ShapID, e.g. 0812345678 or 0812345678@bank",
        },
      ],
    },
    descriptionField,
  ],
  detailRows: [{ key: "shapId", label: "ShapID", fields: ["shapId"], copyable: true }],
  instructions: {
    payer: ["Confirm the recipient name returned by the bank before sending the payment."],
    payee: ["Keep the bank confirmation and transaction reference for reconciliation."],
  },
  evidence: [
    {
      key: "transactionReference",
      label: "Transaction reference",
      type: PaymentFieldType.Text,
      required: true,
      validation: [{ kind: ValidationRuleKind.MinLength, length: 3 }],
    },
  ],
});
