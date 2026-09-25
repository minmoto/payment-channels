import { createCashPaymentChannel } from "../shared.js";

export const cashIdIdrPaymentChannel = createCashPaymentChannel({
  id: "cash_id_idr",
  country: "ID",
  currency: "IDR",
});
