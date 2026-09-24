import { createCashPaymentChannel } from "../shared.js";

export const cashBbBbdPaymentChannel = createCashPaymentChannel({
  id: "cash_bb_bbd",
  country: "BB",
  currency: "BBD",
});
