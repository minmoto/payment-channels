import { createCashPaymentChannel } from "../shared.js";

export const cashSiEurPaymentChannel = createCashPaymentChannel({
  id: "cash_si_eur",
  country: "SI",
  currency: "EUR",
});
