import { createCashPaymentChannel } from "../shared.js";

export const cashTtTtdPaymentChannel = createCashPaymentChannel({
  id: "cash_tt_ttd",
  country: "TT",
  currency: "TTD",
});
