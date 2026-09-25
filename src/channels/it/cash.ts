import { createCashPaymentChannel } from "../shared.js";

export const cashItEurPaymentChannel = createCashPaymentChannel({
  id: "cash_it_eur",
  country: "IT",
  currency: "EUR",
});
