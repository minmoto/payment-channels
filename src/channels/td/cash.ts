import { createCashPaymentChannel } from "../shared.js";

export const cashTdXafPaymentChannel = createCashPaymentChannel({
  id: "cash_td_xaf",
  country: "TD",
  currency: "XAF",
});
