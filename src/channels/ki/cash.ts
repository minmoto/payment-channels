import { createCashPaymentChannel } from "../shared.js";

export const cashKiAudPaymentChannel = createCashPaymentChannel({
  id: "cash_ki_aud",
  country: "KI",
  currency: "AUD",
});
