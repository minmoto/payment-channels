import { createCashPaymentChannel } from "../shared.js";

export const cashAmAmdPaymentChannel = createCashPaymentChannel({
  id: "cash_am_amd",
  country: "AM",
  currency: "AMD",
});
