import { createCashPaymentChannel } from "../shared.js";

export const cashEsEurPaymentChannel = createCashPaymentChannel({
  id: "cash_es_eur",
  country: "ES",
  currency: "EUR",
});
