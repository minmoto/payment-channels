import { createCashPaymentChannel } from "../shared.js";

export const cashChChfPaymentChannel = createCashPaymentChannel({
  id: "cash_ch_chf",
  country: "CH",
  currency: "CHF",
});
