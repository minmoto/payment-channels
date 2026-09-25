import { createCashPaymentChannel } from "../shared.js";

export const cashSjNokPaymentChannel = createCashPaymentChannel({
  id: "cash_sj_nok",
  country: "SJ",
  currency: "NOK",
});
