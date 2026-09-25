import { createCashPaymentChannel } from "../shared.js";

export const cashKpKpwPaymentChannel = createCashPaymentChannel({
  id: "cash_kp_kpw",
  country: "KP",
  currency: "KPW",
});
