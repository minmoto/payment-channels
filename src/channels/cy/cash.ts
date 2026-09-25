import { createCashPaymentChannel } from "../shared.js";

export const cashCyEurPaymentChannel = createCashPaymentChannel({
  id: "cash_cy_eur",
  country: "CY",
  currency: "EUR",
});
