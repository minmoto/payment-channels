import { createCashPaymentChannel } from "../shared.js";

export const cashCvCvePaymentChannel = createCashPaymentChannel({
  id: "cash_cv_cve",
  country: "CV",
  currency: "CVE",
});
