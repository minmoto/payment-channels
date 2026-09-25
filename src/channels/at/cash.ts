import { createCashPaymentChannel } from "../shared.js";

export const cashAtEurPaymentChannel = createCashPaymentChannel({
  id: "cash_at_eur",
  country: "AT",
  currency: "EUR",
});
