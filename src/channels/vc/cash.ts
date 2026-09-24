import { createCashPaymentChannel } from "../shared.js";

export const cashVcXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_vc_xcd",
  country: "VC",
  currency: "XCD",
});
