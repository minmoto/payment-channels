import { createCashPaymentChannel } from "../shared.js";

export const cashWfXpfPaymentChannel = createCashPaymentChannel({
  id: "cash_wf_xpf",
  country: "WF",
  currency: "XPF",
});
