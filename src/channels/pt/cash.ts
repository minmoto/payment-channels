import { createCashPaymentChannel } from "../shared.js";

export const cashPtEurPaymentChannel = createCashPaymentChannel({
  id: "cash_pt_eur",
  country: "PT",
  currency: "EUR",
});
