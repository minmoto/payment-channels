import { createCashPaymentChannel } from "../shared.js";

export const cashBlEurPaymentChannel = createCashPaymentChannel({
  id: "cash_bl_eur",
  country: "BL",
  currency: "EUR",
});
