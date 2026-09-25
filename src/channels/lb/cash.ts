import { createCashPaymentChannel } from "../shared.js";

export const cashLbLbpPaymentChannel = createCashPaymentChannel({
  id: "cash_lb_lbp",
  country: "LB",
  currency: "LBP",
});
