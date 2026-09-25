import { createCashPaymentChannel } from "../shared.js";

export const cashKrKrwPaymentChannel = createCashPaymentChannel({
  id: "cash_kr_krw",
  country: "KR",
  currency: "KRW",
});
