import { createCashPaymentChannel } from "../shared.js";

export const cashMpUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_mp_usd",
  country: "MP",
  currency: "USD",
});
