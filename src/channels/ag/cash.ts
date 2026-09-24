import { createCashPaymentChannel } from "../shared.js";

export const cashAgXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_ag_xcd",
  country: "AG",
  currency: "XCD",
});
