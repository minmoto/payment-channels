import { createCashPaymentChannel } from "../shared.js";

export const cashBeEurPaymentChannel = createCashPaymentChannel({
  id: "cash_be_eur",
  country: "BE",
  currency: "EUR",
});
