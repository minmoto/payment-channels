import { createCashPaymentChannel } from "../shared.js";

export const cashBoBobPaymentChannel = createCashPaymentChannel({
  id: "cash_bo_bob",
  country: "BO",
  currency: "BOB",
});
