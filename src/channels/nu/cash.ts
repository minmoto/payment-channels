import { createCashPaymentChannel } from "../shared.js";

export const cashNuNzdPaymentChannel = createCashPaymentChannel({
  id: "cash_nu_nzd",
  country: "NU",
  currency: "NZD",
});
