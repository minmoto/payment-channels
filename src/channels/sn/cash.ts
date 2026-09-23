import { createCashPaymentChannel } from "../shared.js";

export const cashSnXofPaymentChannel = createCashPaymentChannel({
  id: "cash_sn_xof",
  country: "SN",
  currency: "XOF",
});
