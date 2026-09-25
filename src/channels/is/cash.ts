import { createCashPaymentChannel } from "../shared.js";

export const cashIsIskPaymentChannel = createCashPaymentChannel({
  id: "cash_is_isk",
  country: "IS",
  currency: "ISK",
});
