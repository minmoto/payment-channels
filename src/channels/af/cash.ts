import { createCashPaymentChannel } from "../shared.js";

export const cashAfAfnPaymentChannel = createCashPaymentChannel({
  id: "cash_af_afn",
  country: "AF",
  currency: "AFN",
});
