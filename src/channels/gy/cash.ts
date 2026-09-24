import { createCashPaymentChannel } from "../shared.js";

export const cashGyGydPaymentChannel = createCashPaymentChannel({
  id: "cash_gy_gyd",
  country: "GY",
  currency: "GYD",
});
