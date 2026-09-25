import { createCashPaymentChannel } from "../shared.js";

export const cashRoRonPaymentChannel = createCashPaymentChannel({
  id: "cash_ro_ron",
  country: "RO",
  currency: "RON",
});
