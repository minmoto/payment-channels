import { createCashPaymentChannel } from "../shared.js";

export const cashIqIqdPaymentChannel = createCashPaymentChannel({
  id: "cash_iq_iqd",
  country: "IQ",
  currency: "IQD",
});
