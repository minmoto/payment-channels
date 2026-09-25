import { createCashPaymentChannel } from "../shared.js";

export const cashIeEurPaymentChannel = createCashPaymentChannel({
  id: "cash_ie_eur",
  country: "IE",
  currency: "EUR",
});
