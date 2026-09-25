import { createCashPaymentChannel } from "../shared.js";

export const cashIoUsdPaymentChannel = createCashPaymentChannel({
  id: "cash_io_usd",
  country: "IO",
  currency: "USD",
});
