import { createCashPaymentChannel } from "../shared.js";

export const cashAuAudPaymentChannel = createCashPaymentChannel({
  id: "cash_au_aud",
  country: "AU",
  currency: "AUD",
});
