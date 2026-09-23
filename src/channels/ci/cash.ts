import { createCashPaymentChannel } from "../shared.js";

export const cashCiXofPaymentChannel = createCashPaymentChannel({
  id: "cash_ci_xof",
  country: "CI",
  currency: "XOF",
});
