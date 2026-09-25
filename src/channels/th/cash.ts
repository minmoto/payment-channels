import { createCashPaymentChannel } from "../shared.js";

export const cashThThbPaymentChannel = createCashPaymentChannel({
  id: "cash_th_thb",
  country: "TH",
  currency: "THB",
});
