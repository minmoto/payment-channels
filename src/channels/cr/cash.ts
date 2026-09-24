import { createCashPaymentChannel } from "../shared.js";

export const cashCrCrcPaymentChannel = createCashPaymentChannel({
  id: "cash_cr_crc",
  country: "CR",
  currency: "CRC",
});
