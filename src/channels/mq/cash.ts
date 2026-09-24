import { createCashPaymentChannel } from "../shared.js";

export const cashMqEurPaymentChannel = createCashPaymentChannel({
  id: "cash_mq_eur",
  country: "MQ",
  currency: "EUR",
});
