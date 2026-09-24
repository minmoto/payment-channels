import { createCashPaymentChannel } from "../shared.js";

export const cashCoCopPaymentChannel = createCashPaymentChannel({
  id: "cash_co_cop",
  country: "CO",
  currency: "COP",
});
