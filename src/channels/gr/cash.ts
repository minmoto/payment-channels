import { createCashPaymentChannel } from "../shared.js";

export const cashGrEurPaymentChannel = createCashPaymentChannel({
  id: "cash_gr_eur",
  country: "GR",
  currency: "EUR",
});
