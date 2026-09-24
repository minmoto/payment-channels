import { createCashPaymentChannel } from "../shared.js";

export const cashFkFkpPaymentChannel = createCashPaymentChannel({
  id: "cash_fk_fkp",
  country: "FK",
  currency: "FKP",
});
