import { createCashPaymentChannel } from "../shared.js";

export const cashBsBsdPaymentChannel = createCashPaymentChannel({
  id: "cash_bs_bsd",
  country: "BS",
  currency: "BSD",
});
