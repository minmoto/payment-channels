import { createCashPaymentChannel } from "../shared.js";

export const cashMsXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_ms_xcd",
  country: "MS",
  currency: "XCD",
});
