import { createCashPaymentChannel } from "../shared.js";

export const cashGpEurPaymentChannel = createCashPaymentChannel({
  id: "cash_gp_eur",
  country: "GP",
  currency: "EUR",
});
