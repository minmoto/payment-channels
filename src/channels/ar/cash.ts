import { createCashPaymentChannel } from "../shared.js";

export const cashArArsPaymentChannel = createCashPaymentChannel({
  id: "cash_ar_ars",
  country: "AR",
  currency: "ARS",
});
