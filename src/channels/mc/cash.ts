import { createCashPaymentChannel } from "../shared.js";

export const cashMcEurPaymentChannel = createCashPaymentChannel({
  id: "cash_mc_eur",
  country: "MC",
  currency: "EUR",
});
