import { createCashPaymentChannel } from "../shared.js";

export const cashMrMruPaymentChannel = createCashPaymentChannel({
  id: "cash_mr_mru",
  country: "MR",
  currency: "MRU",
});
