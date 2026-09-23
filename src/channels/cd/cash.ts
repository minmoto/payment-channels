import { createCashPaymentChannel } from "../shared.js";

export const cashCdCdfPaymentChannel = createCashPaymentChannel({
  id: "cash_cd_cdf",
  country: "CD",
  currency: "CDF",
});
