import { createCashPaymentChannel } from "../shared.js";

export const cashRuRubPaymentChannel = createCashPaymentChannel({
  id: "cash_ru_rub",
  country: "RU",
  currency: "RUB",
});
