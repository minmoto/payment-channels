import { createCashPaymentChannel } from "../shared.js";

export const cashLiChfPaymentChannel = createCashPaymentChannel({
  id: "cash_li_chf",
  country: "LI",
  currency: "CHF",
});
