import { createCashPaymentChannel } from "../shared.js";

export const cashSoSosPaymentChannel = createCashPaymentChannel({
  id: "cash_so_sos",
  country: "SO",
  currency: "SOS",
});
