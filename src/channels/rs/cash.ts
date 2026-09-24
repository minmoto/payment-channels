import { createCashPaymentChannel } from "../shared.js";

export const cashRsRsdPaymentChannel = createCashPaymentChannel({
  id: "cash_rs_rsd",
  country: "RS",
  currency: "RSD",
});
