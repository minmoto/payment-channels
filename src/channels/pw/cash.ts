import { createCashPaymentChannel } from "../shared.js";

export const cashPwUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_pw_usd",
  country: "PW",
  currency: "USD",
});
