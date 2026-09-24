import { createCashPaymentChannel } from "../shared.js";

export const cashVeVesPaymentChannel = createCashPaymentChannel({
  id: "cash_ve_ves",
  country: "VE",
  currency: "VES",
});
