import { createCashPaymentChannel } from "../shared.js";

export const cashCzCzkPaymentChannel = createCashPaymentChannel({
  id: "cash_cz_czk",
  country: "CZ",
  currency: "CZK",
});
