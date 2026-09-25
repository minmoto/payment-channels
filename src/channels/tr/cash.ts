import { createCashPaymentChannel } from "../shared.js";

export const cashTrTryPaymentChannel = createCashPaymentChannel({
  id: "cash_tr_try",
  country: "TR",
  currency: "TRY",
});
