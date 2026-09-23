import { createCashPaymentChannel } from "../shared.js";

export const cashTgXofPaymentChannel = createCashPaymentChannel({
  id: "cash_tg_xof",
  country: "TG",
  currency: "XOF",
});
