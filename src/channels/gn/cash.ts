import { createCashPaymentChannel } from "../shared.js";

export const cashGnGnfPaymentChannel = createCashPaymentChannel({
  id: "cash_gn_gnf",
  country: "GN",
  currency: "GNF",
});
