import { createCashPaymentChannel } from "../shared.js";

export const cashLuEurPaymentChannel = createCashPaymentChannel({
  id: "cash_lu_eur",
  country: "LU",
  currency: "EUR",
});
