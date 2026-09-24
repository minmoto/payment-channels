import { createCashPaymentChannel } from "../shared.js";

export const cashVgUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_vg_usd",
  country: "VG",
  currency: "USD",
});
