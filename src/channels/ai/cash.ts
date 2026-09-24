import { createCashPaymentChannel } from "../shared.js";

export const cashAiXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_ai_xcd",
  country: "AI",
  currency: "XCD",
});
