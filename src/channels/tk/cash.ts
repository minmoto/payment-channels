import { createCashPaymentChannel } from "../shared.js";

export const cashTkNzdPaymentChannel = createCashPaymentChannel({
  id: "cash_tk_nzd",
  country: "TK",
  currency: "NZD",
});
