import { createCashPaymentChannel } from "../shared.js";

export const cashLaLakPaymentChannel = createCashPaymentChannel({
  id: "cash_la_lak",
  country: "LA",
  currency: "LAK",
});
