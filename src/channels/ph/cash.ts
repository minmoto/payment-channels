import { createCashPaymentChannel } from "../shared.js";

export const cashPhPhpPaymentChannel = createCashPaymentChannel({
  id: "cash_ph_php",
  country: "PH",
  currency: "PHP",
});
