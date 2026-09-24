import { createCashPaymentChannel } from "../shared.js";

export const cashHrEurPaymentChannel = createCashPaymentChannel({
  id: "cash_hr_eur",
  country: "HR",
  currency: "EUR",
});
