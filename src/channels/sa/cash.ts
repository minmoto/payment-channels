import { createCashPaymentChannel } from "../shared.js";

export const cashSaSarPaymentChannel = createCashPaymentChannel({
  id: "cash_sa_sar",
  country: "SA",
  currency: "SAR",
});
