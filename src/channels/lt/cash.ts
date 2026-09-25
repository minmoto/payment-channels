import { createCashPaymentChannel } from "../shared.js";

export const cashLtEurPaymentChannel = createCashPaymentChannel({
  id: "cash_lt_eur",
  country: "LT",
  currency: "EUR",
});
