import { createCashPaymentChannel } from "../shared.js";

export const cashAdEurPaymentChannel = createCashPaymentChannel({
  id: "cash_ad_eur",
  country: "AD",
  currency: "EUR",
});
