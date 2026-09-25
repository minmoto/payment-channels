import { createCashPaymentChannel } from "../shared.js";

export const cashCnCnyPaymentChannel = createCashPaymentChannel({
  id: "cash_cn_cny",
  country: "CN",
  currency: "CNY",
});
