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

export const payshapAccountZaZarPaymentChannel = definePaymentChannelSchema({
  id: "payshap_account_za_zar",
  version: 1,
  display: {
    label: "PayShap bank account",
    shortLabel: "PayShap account",
    description: "South African real-time PayShap transfer to a bank account.",
    icon: "payshap",
    group: PaymentChannelGroup.Bank,
  },
  network: { id: "payshap", label: "PayShap", country: "ZA", currency: "ZAR" },
  support: {
    automation: PaymentChannelAutomation.Manual,
  },
  fields: [
    {
      key: "recipientName",
      label: "Recipient name",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "Recipient name",
      normalize: [NormalizationKind.Trim],
    },
    {
      key: "bankName",
      label: "Bank",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "Recipient bank",
      normalize: [NormalizationKind.Trim],
    },
    {
      key: "accountNumber",
      label: "Account number",
      type: PaymentFieldType.BankAccount,
      required: true,
      placeholder: "Recipient account number",
      sensitive: true,
      mask: MaskingKind.Last4,
      normalize: [NormalizationKind.Trim],
    },
    descriptionField,
  ],
  detailRows: [
    { key: "recipientName", label: "Recipient name", fields: ["recipientName"] },
    { key: "bankName", label: "Bank", fields: ["bankName"] },
    { key: "accountNumber", label: "Account number", fields: ["accountNumber"], copyable: true },
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
