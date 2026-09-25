import { createCashPaymentChannel } from "../shared.js";

export const cashPsIlsPaymentChannel = createCashPaymentChannel({
  id: "cash_ps_ils",
  country: "PS",
  currency: "ILS",
});
