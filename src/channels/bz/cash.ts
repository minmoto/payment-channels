import { createCashPaymentChannel } from "../shared.js";

export const cashBzBzdPaymentChannel = createCashPaymentChannel({
  id: "cash_bz_bzd",
  country: "BZ",
  currency: "BZD",
});
