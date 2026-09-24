import { createCashPaymentChannel } from "../shared.js";

export const cashNlEurPaymentChannel = createCashPaymentChannel({
  id: "cash_nl_eur",
  country: "NL",
  currency: "EUR",
});
