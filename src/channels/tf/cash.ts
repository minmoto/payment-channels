import { createCashPaymentChannel } from "../shared.js";

export const cashTfEurPaymentChannel = createCashPaymentChannel({
  id: "cash_tf_eur",
  country: "TF",
  currency: "EUR",
});
