import { createCashPaymentChannel } from "../shared.js";

export const cashFoDkkPaymentChannel = createCashPaymentChannel({
  id: "cash_fo_dkk",
  country: "FO",
  currency: "DKK",
});
