import { createCashPaymentChannel } from "../shared.js";

export const cashSmEurPaymentChannel = createCashPaymentChannel({
  id: "cash_sm_eur",
  country: "SM",
  currency: "EUR",
});
