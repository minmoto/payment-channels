import { createCashPaymentChannel } from "../shared.js";

export const cashMxMxnPaymentChannel = createCashPaymentChannel({
  id: "cash_mx_mxn",
  country: "MX",
  currency: "MXN",
});
