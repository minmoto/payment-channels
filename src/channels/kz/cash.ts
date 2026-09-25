import { createCashPaymentChannel } from "../shared.js";

export const cashKzKztPaymentChannel = createCashPaymentChannel({
  id: "cash_kz_kzt",
  country: "KZ",
  currency: "KZT",
});
