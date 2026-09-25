import { createCashPaymentChannel } from "../shared.js";

export const cashUaUahPaymentChannel = createCashPaymentChannel({
  id: "cash_ua_uah",
  country: "UA",
  currency: "UAH",
});
