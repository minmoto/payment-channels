import { createCashPaymentChannel } from "../shared.js";

export const cashCwAngPaymentChannel = createCashPaymentChannel({
  id: "cash_cw_ang",
  country: "CW",
  currency: "ANG",
});
