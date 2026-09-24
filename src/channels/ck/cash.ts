import { createCashPaymentChannel } from "../shared.js";

export const cashCkNzdPaymentChannel = createCashPaymentChannel({
  id: "cash_ck_nzd",
  country: "CK",
  currency: "NZD",
});
