import { createCashPaymentChannel } from "../shared.js";

export const cashLvEurPaymentChannel = createCashPaymentChannel({
  id: "cash_lv_eur",
  country: "LV",
  currency: "EUR",
});
