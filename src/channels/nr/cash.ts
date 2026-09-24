import { createCashPaymentChannel } from "../shared.js";

export const cashNrAudPaymentChannel = createCashPaymentChannel({
  id: "cash_nr_aud",
  country: "NR",
  currency: "AUD",
});
