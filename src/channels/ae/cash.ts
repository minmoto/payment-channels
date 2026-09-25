import { createCashPaymentChannel } from "../shared.js";

export const cashAeAedPaymentChannel = createCashPaymentChannel({
  id: "cash_ae_aed",
  country: "AE",
  currency: "AED",
});
