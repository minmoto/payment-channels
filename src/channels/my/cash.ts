import { createCashPaymentChannel } from "../shared.js";

export const cashMyMyrPaymentChannel = createCashPaymentChannel({
  id: "cash_my_myr",
  country: "MY",
  currency: "MYR",
});
