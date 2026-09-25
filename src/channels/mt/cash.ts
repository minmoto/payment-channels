import { createCashPaymentChannel } from "../shared.js";

export const cashMtEurPaymentChannel = createCashPaymentChannel({
  id: "cash_mt_eur",
  country: "MT",
  currency: "EUR",
});
