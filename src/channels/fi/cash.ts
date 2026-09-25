import { createCashPaymentChannel } from "../shared.js";

export const cashFiEurPaymentChannel = createCashPaymentChannel({
  id: "cash_fi_eur",
  country: "FI",
  currency: "EUR",
});
