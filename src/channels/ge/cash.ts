import { createCashPaymentChannel } from "../shared.js";

export const cashGeGelPaymentChannel = createCashPaymentChannel({
  id: "cash_ge_gel",
  country: "GE",
  currency: "GEL",
});
