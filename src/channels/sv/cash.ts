import { createCashPaymentChannel } from "../shared.js";

export const cashSvUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_sv_usd",
  country: "SV",
  currency: "USD",
});
