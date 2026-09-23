import { createCashPaymentChannel } from "../shared.js";

export const cashCfXafPaymentChannel = createCashPaymentChannel({
  id: "cash_cf_xaf",
  country: "CF",
  currency: "XAF",
});
