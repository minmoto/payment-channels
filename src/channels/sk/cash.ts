import { createCashPaymentChannel } from "../shared.js";

export const cashSkEurPaymentChannel = createCashPaymentChannel({
  id: "cash_sk_eur",
  country: "SK",
  currency: "EUR",
});
