import { createCashPaymentChannel } from "../shared.js";

export const cashEeEurPaymentChannel = createCashPaymentChannel({
  id: "cash_ee_eur",
  country: "EE",
  currency: "EUR",
});
