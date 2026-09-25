import { createCashPaymentChannel } from "../shared.js";

export const cashSeSekPaymentChannel = createCashPaymentChannel({
  id: "cash_se_sek",
  country: "SE",
  currency: "SEK",
});
