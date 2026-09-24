import { createCashPaymentChannel } from "../shared.js";

export const cashLcXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_lc_xcd",
  country: "LC",
  currency: "XCD",
});
