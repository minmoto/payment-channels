import { createCashPaymentChannel } from "../shared.js";

export const cashMlXofPaymentChannel = createCashPaymentChannel({
  id: "cash_ml_xof",
  country: "ML",
  currency: "XOF",
});
