import { createCashPaymentChannel } from "../shared.js";

export const cashJpJpyPaymentChannel = createCashPaymentChannel({
  id: "cash_jp_jpy",
  country: "JP",
  currency: "JPY",
});
