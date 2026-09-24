import { createCashPaymentChannel } from "../shared.js";

export const cashGuUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_gu_usd",
  country: "GU",
  currency: "USD",
});
