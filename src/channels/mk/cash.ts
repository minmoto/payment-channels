import { createCashPaymentChannel } from "../shared.js";

export const cashMkMkdPaymentChannel = createCashPaymentChannel({
  id: "cash_mk_mkd",
  country: "MK",
  currency: "MKD",
});
