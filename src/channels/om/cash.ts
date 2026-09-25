import { createCashPaymentChannel } from "../shared.js";

export const cashOmOmrPaymentChannel = createCashPaymentChannel({
  id: "cash_om_omr",
  country: "OM",
  currency: "OMR",
});
