import { createCashPaymentChannel } from "../shared.js";

export const cashYeYerPaymentChannel = createCashPaymentChannel({
  id: "cash_ye_yer",
  country: "YE",
  currency: "YER",
});
