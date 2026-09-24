import { createCashPaymentChannel } from "../shared.js";

export const cashAsUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_as_usd",
  country: "AS",
  currency: "USD",
});
