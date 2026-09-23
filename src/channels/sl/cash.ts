import { createCashPaymentChannel } from "../shared.js";

export const cashSlSlePaymentChannel = createCashPaymentChannel({
  id: "cash_sl_sle",
  country: "SL",
  currency: "SLE",
});
