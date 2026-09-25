import { createCashPaymentChannel } from "../shared.js";

export const cashBnBndPaymentChannel = createCashPaymentChannel({
  id: "cash_bn_bnd",
  country: "BN",
  currency: "BND",
});
