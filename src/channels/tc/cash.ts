import { createCashPaymentChannel } from "../shared.js";

export const cashTcUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_tc_usd",
  country: "TC",
  currency: "USD",
});
