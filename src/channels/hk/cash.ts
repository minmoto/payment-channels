import { createCashPaymentChannel } from "../shared.js";

export const cashHkHkdPaymentChannel = createCashPaymentChannel({
  id: "cash_hk_hkd",
  country: "HK",
  currency: "HKD",
});
