import { createCashPaymentChannel } from "../shared.js";

export const cashTwTwdPaymentChannel = createCashPaymentChannel({
  id: "cash_tw_twd",
  country: "TW",
  currency: "TWD",
});
