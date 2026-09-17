import { createCashPaymentChannel } from "../shared.js";

export const cashMwMwkPaymentChannel = createCashPaymentChannel({
  id: "cash_mw_mwk",
  country: "MW",
  currency: "MWK",
});
