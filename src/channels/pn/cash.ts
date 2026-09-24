import { createCashPaymentChannel } from "../shared.js";

export const cashPnNzdPaymentChannel = createCashPaymentChannel({
  id: "cash_pn_nzd",
  country: "PN",
  currency: "NZD",
});
