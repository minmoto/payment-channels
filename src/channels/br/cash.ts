import { createCashPaymentChannel } from "../shared.js";

export const cashBrBrlPaymentChannel = createCashPaymentChannel({
  id: "cash_br_brl",
  country: "BR",
  currency: "BRL",
});
