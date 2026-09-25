import { createCashPaymentChannel } from "../shared.js";

export const cashUzUzsPaymentChannel = createCashPaymentChannel({
  id: "cash_uz_uzs",
  country: "UZ",
  currency: "UZS",
});
