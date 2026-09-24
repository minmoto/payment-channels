import { createCashPaymentChannel } from "../shared.js";

export const cashTvAudPaymentChannel = createCashPaymentChannel({
  id: "cash_tv_aud",
  country: "TV",
  currency: "AUD",
});
