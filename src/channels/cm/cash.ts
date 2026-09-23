import { createCashPaymentChannel } from "../shared.js";

export const cashCmXafPaymentChannel = createCashPaymentChannel({
  id: "cash_cm_xaf",
  country: "CM",
  currency: "XAF",
});
