import { createCashPaymentChannel } from "../shared.js";

export const cashSgSgdPaymentChannel = createCashPaymentChannel({
  id: "cash_sg_sgd",
  country: "SG",
  currency: "SGD",
});
