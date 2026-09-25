import { createCashPaymentChannel } from "../shared.js";

export const cashMvMvrPaymentChannel = createCashPaymentChannel({
  id: "cash_mv_mvr",
  country: "MV",
  currency: "MVR",
});
