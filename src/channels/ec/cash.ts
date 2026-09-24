import { createCashPaymentChannel } from "../shared.js";

export const cashEcUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_ec_usd",
  country: "EC",
  currency: "USD",
});
