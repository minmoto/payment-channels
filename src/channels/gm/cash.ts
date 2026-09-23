import { createCashPaymentChannel } from "../shared.js";

export const cashGmGmdPaymentChannel = createCashPaymentChannel({
  id: "cash_gm_gmd",
  country: "GM",
  currency: "GMD",
});
