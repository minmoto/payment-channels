import { createCashPaymentChannel } from "../shared.js";

export const cashBfXofPaymentChannel = createCashPaymentChannel({
  id: "cash_bf_xof",
  country: "BF",
  currency: "XOF",
});
