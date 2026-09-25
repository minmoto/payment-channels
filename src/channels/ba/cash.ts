import { createCashPaymentChannel } from "../shared.js";

export const cashBaBamPaymentChannel = createCashPaymentChannel({
  id: "cash_ba_bam",
  country: "BA",
  currency: "BAM",
});
