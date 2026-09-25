import { createCashPaymentChannel } from "../shared.js";

export const cashKhKhrPaymentChannel = createCashPaymentChannel({
  id: "cash_kh_khr",
  country: "KH",
  currency: "KHR",
});
