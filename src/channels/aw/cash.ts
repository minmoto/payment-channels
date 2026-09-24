import { createCashPaymentChannel } from "../shared.js";

export const cashAwAwgPaymentChannel = createCashPaymentChannel({
  id: "cash_aw_awg",
  country: "AW",
  currency: "AWG",
});
