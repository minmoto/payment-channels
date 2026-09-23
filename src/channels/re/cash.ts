import { createCashPaymentChannel } from "../shared.js";

export const cashReEurPaymentChannel = createCashPaymentChannel({
  id: "cash_re_eur",
  country: "RE",
  currency: "EUR",
});
