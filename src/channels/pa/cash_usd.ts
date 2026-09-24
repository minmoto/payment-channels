import { createCashPaymentChannel } from "../shared.js";

export const cashPaUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_pa_usd",
  country: "PA",
  currency: "USD",
});
