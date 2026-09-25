import { createCashPaymentChannel } from "../shared.js";

export const cashIlIlsPaymentChannel = createCashPaymentChannel({
  id: "cash_il_ils",
  country: "IL",
  currency: "ILS",
});
