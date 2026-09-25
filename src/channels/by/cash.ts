import { createCashPaymentChannel } from "../shared.js";

export const cashByBynPaymentChannel = createCashPaymentChannel({
  id: "cash_by_byn",
  country: "BY",
  currency: "BYN",
});
