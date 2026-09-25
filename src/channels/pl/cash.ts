import { createCashPaymentChannel } from "../shared.js";

export const cashPlPlnPaymentChannel = createCashPaymentChannel({
  id: "cash_pl_pln",
  country: "PL",
  currency: "PLN",
});
