import { createCashPaymentChannel } from "../shared.js";

export const cashPrUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_pr_usd",
  country: "PR",
  currency: "USD",
});
