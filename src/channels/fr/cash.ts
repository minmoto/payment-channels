import { createCashPaymentChannel } from "../shared.js";

export const cashFrEurPaymentChannel = createCashPaymentChannel({
  id: "cash_fr_eur",
  country: "FR",
  currency: "EUR",
});
