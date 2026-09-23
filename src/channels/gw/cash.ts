import { createCashPaymentChannel } from "../shared.js";

export const cashGwXofPaymentChannel = createCashPaymentChannel({
  id: "cash_gw_xof",
  country: "GW",
  currency: "XOF",
});
