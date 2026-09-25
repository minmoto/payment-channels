import { createCashPaymentChannel } from "../shared.js";

export const cashTmTmtPaymentChannel = createCashPaymentChannel({
  id: "cash_tm_tmt",
  country: "TM",
  currency: "TMT",
});
