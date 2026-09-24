import { createCashPaymentChannel } from "../shared.js";

export const cashPaPabPaymentChannel = createCashPaymentChannel({
  id: "cash_pa_pab",
  country: "PA",
  currency: "PAB",
});
