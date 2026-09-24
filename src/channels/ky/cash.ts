import { createCashPaymentChannel } from "../shared.js";

export const cashKyKydPaymentChannel = createCashPaymentChannel({
  id: "cash_ky_kyd",
  country: "KY",
  currency: "KYD",
});
