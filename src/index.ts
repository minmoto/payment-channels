export {
  MaskingKind,
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  addPaymentChannelSchema,
  definePaymentChannelSchema,
  getPaymentChannelSchema,
  listPaymentChannelSchemas,
  maskFieldValue,
  normalizeFieldValue,
  renderDetailRows,
  validatePaymentChannelData,
  type CountryCode,
  type CurrencyCode,
  type DetailRow,
  type EvidenceField,
  type PaymentChannelField,
  type PaymentChannelId,
  type PaymentChannelSchema,
  type PaymentInstructions,
  type PaymentNetwork,
  type MoneyNetworkId,
  type RenderedDetailRow,
  type SelectOption,
  type ValidationIssue,
  type ValidationResult,
  type ValidationRule,
} from "./core.js";

import { buildPaymentChannelRegistry, type PaymentChannelSchema, type PaymentChannelId } from "./core.js";
import { builtinPaymentChannels } from "./channels/index.js";

export {
  airtelMoneyKeKesPaymentChannel,
  airtelMoneyMwMwkPaymentChannel,
  builtinPaymentChannels,
  cashKeKesPaymentChannel,
  mpesaPaybillKeKesPaymentChannel,
  mpesaPhoneKeKesPaymentChannel,
  mpesaTillKeKesPaymentChannel,
  payshapAccountZaZarPaymentChannel,
  payshapShapidZaZarPaymentChannel,
  tnmMpambaMwMwkPaymentChannel,
} from "./channels/index.js";

export function createPaymentChannelRegistry(
  schemas: readonly PaymentChannelSchema[] = builtinPaymentChannels,
): Map<PaymentChannelId, PaymentChannelSchema> {
  return buildPaymentChannelRegistry(schemas);
}
