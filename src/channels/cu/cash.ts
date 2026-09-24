import { createCashPaymentChannel } from "../shared.js";

export const cashCuCupPaymentChannel = createCashPaymentChannel({
  id: "cash_cu_cup",
  country: "CU",
  currency: "CUP",
});
