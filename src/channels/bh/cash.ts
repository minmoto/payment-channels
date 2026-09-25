import { createCashPaymentChannel } from "../shared.js";

export const cashBhBhdPaymentChannel = createCashPaymentChannel({
  id: "cash_bh_bhd",
  country: "BH",
  currency: "BHD",
});
