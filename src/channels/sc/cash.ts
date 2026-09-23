import { createCashPaymentChannel } from "../shared.js";

export const cashScScrPaymentChannel = createCashPaymentChannel({
  id: "cash_sc_scr",
  country: "SC",
  currency: "SCR",
});
