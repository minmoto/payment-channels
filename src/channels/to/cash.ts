import { createCashPaymentChannel } from "../shared.js";

export const cashToTopPaymentChannel = createCashPaymentChannel({
  id: "cash_to_top",
  country: "TO",
  currency: "TOP",
});
