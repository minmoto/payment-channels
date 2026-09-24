import { createCashPaymentChannel } from "../shared.js";

export const cashSbSbdPaymentChannel = createCashPaymentChannel({
  id: "cash_sb_sbd",
  country: "SB",
  currency: "SBD",
});
