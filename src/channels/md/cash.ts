import { createCashPaymentChannel } from "../shared.js";

export const cashMdMdlPaymentChannel = createCashPaymentChannel({
  id: "cash_md_mdl",
  country: "MD",
  currency: "MDL",
});
