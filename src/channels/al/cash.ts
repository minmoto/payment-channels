import { createCashPaymentChannel } from "../shared.js";

export const cashAlAllPaymentChannel = createCashPaymentChannel({
  id: "cash_al_all",
  country: "AL",
  currency: "ALL",
});
