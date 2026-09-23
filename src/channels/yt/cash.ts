import { createCashPaymentChannel } from "../shared.js";

export const cashYtEurPaymentChannel = createCashPaymentChannel({
  id: "cash_yt_eur",
  country: "YT",
  currency: "EUR",
});
