import { createCashPaymentChannel } from "../shared.js";

export const cashNeXofPaymentChannel = createCashPaymentChannel({
  id: "cash_ne_xof",
  country: "NE",
  currency: "XOF",
});
