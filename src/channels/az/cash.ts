import { createCashPaymentChannel } from "../shared.js";

export const cashAzAznPaymentChannel = createCashPaymentChannel({
  id: "cash_az_azn",
  country: "AZ",
  currency: "AZN",
});
