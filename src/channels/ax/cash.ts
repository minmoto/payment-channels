import { createCashPaymentChannel } from "../shared.js";

export const cashAxEurPaymentChannel = createCashPaymentChannel({
  id: "cash_ax_eur",
  country: "AX",
  currency: "EUR",
});
