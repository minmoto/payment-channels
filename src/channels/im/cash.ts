import { createCashPaymentChannel } from "../shared.js";

export const cashImGbpPaymentChannel = createCashPaymentChannel({
  id: "cash_im_gbp",
  country: "IM",
  currency: "GBP",
});
