import { createCashPaymentChannel } from "../shared.js";

export const cashMhUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_mh_usd",
  country: "MH",
  currency: "USD",
});
