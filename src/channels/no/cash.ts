import { createCashPaymentChannel } from "../shared.js";

export const cashNoNokPaymentChannel = createCashPaymentChannel({
  id: "cash_no_nok",
  country: "NO",
  currency: "NOK",
});
