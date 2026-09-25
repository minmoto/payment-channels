import { createCashPaymentChannel } from "../shared.js";

export const cashSySypPaymentChannel = createCashPaymentChannel({
  id: "cash_sy_syp",
  country: "SY",
  currency: "SYP",
});
