import { createCashPaymentChannel } from "../shared.js";

export const cashKeKesPaymentChannel = createCashPaymentChannel({
  id: "cash_ke_kes",
  country: "KE",
  currency: "KES",
});
