import { createCashPaymentChannel } from "../shared.js";

export const cashBgBgnPaymentChannel = createCashPaymentChannel({
  id: "cash_bg_bgn",
  country: "BG",
  currency: "BGN",
});
