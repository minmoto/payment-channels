import { createCashPaymentChannel } from "../shared.js";

export const cashTlUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_tl_usd",
  country: "TL",
  currency: "USD",
});
