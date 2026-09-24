import { createCashPaymentChannel } from "../shared.js";

export const cashGdXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_gd_xcd",
  country: "GD",
  currency: "XCD",
});
