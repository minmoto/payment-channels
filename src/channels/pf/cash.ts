import { createCashPaymentChannel } from "../shared.js";

export const cashPfXpfPaymentChannel = createCashPaymentChannel({
  id: "cash_pf_xpf",
  country: "PF",
  currency: "XPF",
});
