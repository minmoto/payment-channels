import { createCashPaymentChannel } from "../shared.js";

export const cashNfAudPaymentChannel = createCashPaymentChannel({
  id: "cash_nf_aud",
  country: "NF",
  currency: "AUD",
});
