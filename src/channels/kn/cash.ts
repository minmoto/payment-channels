import { createCashPaymentChannel } from "../shared.js";

export const cashKnXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_kn_xcd",
  country: "KN",
  currency: "XCD",
});
