import { createCashPaymentChannel } from "../shared.js";

export const cashGqXafPaymentChannel = createCashPaymentChannel({
  id: "cash_gq_xaf",
  country: "GQ",
  currency: "XAF",
});
