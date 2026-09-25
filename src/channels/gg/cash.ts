import { createCashPaymentChannel } from "../shared.js";

export const cashGgGbpPaymentChannel = createCashPaymentChannel({
  id: "cash_gg_gbp",
  country: "GG",
  currency: "GBP",
});
