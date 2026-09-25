import { createCashPaymentChannel } from "../shared.js";

export const cashDeEurPaymentChannel = createCashPaymentChannel({
  id: "cash_de_eur",
  country: "DE",
  currency: "EUR",
});
