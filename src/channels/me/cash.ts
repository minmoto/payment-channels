import { createCashPaymentChannel } from "../shared.js";

export const cashMeEurPaymentChannel = createCashPaymentChannel({
  id: "cash_me_eur",
  country: "ME",
  currency: "EUR",
});
