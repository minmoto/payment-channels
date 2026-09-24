import { createCashPaymentChannel } from "../shared.js";

export const cashClClpPaymentChannel = createCashPaymentChannel({
  id: "cash_cl_clp",
  country: "CL",
  currency: "CLP",
});
