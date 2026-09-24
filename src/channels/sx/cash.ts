import { createCashPaymentChannel } from "../shared.js";

export const cashSxAngPaymentChannel = createCashPaymentChannel({
  id: "cash_sx_ang",
  country: "SX",
  currency: "ANG",
});
