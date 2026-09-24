import { createCashPaymentChannel } from "../shared.js";

export const cashNcXpfPaymentChannel = createCashPaymentChannel({
  id: "cash_nc_xpf",
  country: "NC",
  currency: "XPF",
});
