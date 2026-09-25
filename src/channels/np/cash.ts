import { createCashPaymentChannel } from "../shared.js";

export const cashNpNprPaymentChannel = createCashPaymentChannel({
  id: "cash_np_npr",
  country: "NP",
  currency: "NPR",
});
