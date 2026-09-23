import { createCashPaymentChannel } from "../shared.js";

export const cashStStnPaymentChannel = createCashPaymentChannel({
  id: "cash_st_stn",
  country: "ST",
  currency: "STN",
});
