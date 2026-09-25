import { createCashPaymentChannel } from "../shared.js";

export const cashJoJodPaymentChannel = createCashPaymentChannel({
  id: "cash_jo_jod",
  country: "JO",
  currency: "JOD",
});
