import { createCashPaymentChannel } from "../shared.js";

export const cashVaEurPaymentChannel = createCashPaymentChannel({
  id: "cash_va_eur",
  country: "VA",
  currency: "EUR",
});
