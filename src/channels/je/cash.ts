import { createCashPaymentChannel } from "../shared.js";

export const cashJeGbpPaymentChannel = createCashPaymentChannel({
  id: "cash_je_gbp",
  country: "JE",
  currency: "GBP",
});
