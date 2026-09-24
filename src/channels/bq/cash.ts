import { createCashPaymentChannel } from "../shared.js";

export const cashBqUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_bq_usd",
  country: "BQ",
  currency: "USD",
});
