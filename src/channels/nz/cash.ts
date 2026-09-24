import { createCashPaymentChannel } from "../shared.js";

export const cashNzNzdPaymentChannel = createCashPaymentChannel({
  id: "cash_nz_nzd",
  country: "NZ",
  currency: "NZD",
});
