import { createCashPaymentChannel } from "../shared.js";

export const cashErErnPaymentChannel = createCashPaymentChannel({
  id: "cash_er_ern",
  country: "ER",
  currency: "ERN",
});
