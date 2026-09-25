import { createCashPaymentChannel } from "../shared.js";

export const cashDkDkkPaymentChannel = createCashPaymentChannel({
  id: "cash_dk_dkk",
  country: "DK",
  currency: "DKK",
});
