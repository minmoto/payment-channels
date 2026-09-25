import { createCashPaymentChannel } from "../shared.js";

export const cashIrIrrPaymentChannel = createCashPaymentChannel({
  id: "cash_ir_irr",
  country: "IR",
  currency: "IRR",
});
