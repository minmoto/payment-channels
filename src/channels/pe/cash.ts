import { createCashPaymentChannel } from "../shared.js";

export const cashPePenPaymentChannel = createCashPaymentChannel({
  id: "cash_pe_pen",
  country: "PE",
  currency: "PEN",
});
