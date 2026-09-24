import { createCashPaymentChannel } from "../shared.js";

export const cashSrSrdPaymentChannel = createCashPaymentChannel({
  id: "cash_sr_srd",
  country: "SR",
  currency: "SRD",
});
