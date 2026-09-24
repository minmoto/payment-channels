import { createCashPaymentChannel } from "../shared.js";

export const cashNiNioPaymentChannel = createCashPaymentChannel({
  id: "cash_ni_nio",
  country: "NI",
  currency: "NIO",
});
