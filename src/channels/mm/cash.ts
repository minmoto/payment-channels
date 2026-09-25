import { createCashPaymentChannel } from "../shared.js";

export const cashMmMmkPaymentChannel = createCashPaymentChannel({
  id: "cash_mm_mmk",
  country: "MM",
  currency: "MMK",
});
