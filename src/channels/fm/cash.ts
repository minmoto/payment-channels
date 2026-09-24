import { createCashPaymentChannel } from "../shared.js";

export const cashFmUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_fm_usd",
  country: "FM",
  currency: "USD",
});
