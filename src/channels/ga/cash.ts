import { createCashPaymentChannel } from "../shared.js";

export const cashGaXafPaymentChannel = createCashPaymentChannel({
  id: "cash_ga_xaf",
  country: "GA",
  currency: "XAF",
});
