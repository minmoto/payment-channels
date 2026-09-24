import { createCashPaymentChannel } from "../shared.js";

export const cashHnHnlPaymentChannel = createCashPaymentChannel({
  id: "cash_hn_hnl",
  country: "HN",
  currency: "HNL",
});
