import { createCashPaymentChannel } from "../shared.js";

export const cashTjTjsPaymentChannel = createCashPaymentChannel({
  id: "cash_tj_tjs",
  country: "TJ",
  currency: "TJS",
});
