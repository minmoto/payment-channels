import { createCashPaymentChannel } from "../shared.js";

export const cashJmJmdPaymentChannel = createCashPaymentChannel({
  id: "cash_jm_jmd",
  country: "JM",
  currency: "JMD",
});
