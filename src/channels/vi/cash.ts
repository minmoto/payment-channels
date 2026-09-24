import { createCashPaymentChannel } from "../shared.js";

export const cashViUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_vi_usd",
  country: "VI",
  currency: "USD",
});
