import { createCashPaymentChannel } from "../shared.js";

export const cashGfEurPaymentChannel = createCashPaymentChannel({
  id: "cash_gf_eur",
  country: "GF",
  currency: "EUR",
});
