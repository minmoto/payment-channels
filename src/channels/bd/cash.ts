import { createCashPaymentChannel } from "../shared.js";

export const cashBdBdtPaymentChannel = createCashPaymentChannel({
  id: "cash_bd_bdt",
  country: "BD",
  currency: "BDT",
});
