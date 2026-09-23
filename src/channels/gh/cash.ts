import { createCashPaymentChannel } from "../shared.js";

export const cashGhGhsPaymentChannel = createCashPaymentChannel({
  id: "cash_gh_ghs",
  country: "GH",
  currency: "GHS",
});
