import { createCashPaymentChannel } from "../shared.js";

export const cashLrLrdPaymentChannel = createCashPaymentChannel({
  id: "cash_lr_lrd",
  country: "LR",
  currency: "LRD",
});
