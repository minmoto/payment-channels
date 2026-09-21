import {
  MaskingKind,
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "../../core.js";
import { descriptionField } from "../shared.js";

export const pesalinkAccountKeKesPaymentChannel = definePaymentChannelSchema({
  id: "pesalink_account_ke_kes",
  version: 1,
  display: {
    label: "PesaLink bank account",
    shortLabel: "PesaLink",
    description: "Kenyan PesaLink transfer to a bank account.",
    icon: "pesalink",
    group: PaymentChannelGroup.Bank,
  },
  network: {
    id: "pesalink",
    label: "PesaLink",
    country: "KE",
    currency: "KES",
  },
  support: { automation: PaymentChannelAutomation.Manual },
  fields: [
    {
      key: "recipientName",
      label: "Recipient name",
      type: PaymentFieldType.Text,
      required: true,
      normalize: [NormalizationKind.Trim],
      validation: [{ kind: ValidationRuleKind.MinLength, length: 1 }],
    },
    {
      key: "bankName",
      label: "Bank",
      type: PaymentFieldType.Text,
      required: true,
      normalize: [NormalizationKind.Trim],
      validation: [{ kind: ValidationRuleKind.MinLength, length: 1 }],
    },
    {
      key: "accountNumber",
      label: "Account number",
      type: PaymentFieldType.BankAccount,
      required: true,
      sensitive: true,
      mask: MaskingKind.Last4,
      normalize: [NormalizationKind.Trim],
      validation: [{ kind: ValidationRuleKind.MinLength, length: 1 }],
    },
    descriptionField,
  ],
  detailRows: [
    {
      key: "recipientName",
      label: "Recipient name",
      fields: ["recipientName"],
    },
    { key: "bankName", label: "Bank", fields: ["bankName"] },
    {
      key: "accountNumber",
      label: "Account number",
      fields: ["accountNumber"],
      copyable: true,
    },
  ],
  instructions: {
    payer: ["Confirm the recipient name, bank, and account number directly before sending the payment."],
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
