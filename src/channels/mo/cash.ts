import { createCashPaymentChannel } from "../shared.js";

export const cashMoMopPaymentChannel = createCashPaymentChannel({
  id: "cash_mo_mop",
  country: "MO",
  currency: "MOP",
});
