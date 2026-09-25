import { createCashPaymentChannel } from "../shared.js";

export const cashGiGipPaymentChannel = createCashPaymentChannel({
  id: "cash_gi_gip",
  country: "GI",
  currency: "GIP",
});
