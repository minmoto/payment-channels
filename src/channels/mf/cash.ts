import { createCashPaymentChannel } from "../shared.js";

export const cashMfEurPaymentChannel = createCashPaymentChannel({
  id: "cash_mf_eur",
  country: "MF",
  currency: "EUR",
});
