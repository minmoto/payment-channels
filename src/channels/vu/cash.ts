import { createCashPaymentChannel } from "../shared.js";

export const cashVuVuvPaymentChannel = createCashPaymentChannel({
  id: "cash_vu_vuv",
  country: "VU",
  currency: "VUV",
});
