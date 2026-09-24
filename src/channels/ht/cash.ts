import { createCashPaymentChannel } from "../shared.js";

export const cashHtHtgPaymentChannel = createCashPaymentChannel({
  id: "cash_ht_htg",
  country: "HT",
  currency: "HTG",
});
