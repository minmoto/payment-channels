import { createCashPaymentChannel } from "../shared.js";

export const cashZaZarPaymentChannel = createCashPaymentChannel({
  id: "cash_za_zar",
  country: "ZA",
  currency: "ZAR",
});
