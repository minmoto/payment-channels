import { createCashPaymentChannel } from "../shared.js";

export const cashCgXafPaymentChannel = createCashPaymentChannel({
  id: "cash_cg_xaf",
  country: "CG",
  currency: "XAF",
});
