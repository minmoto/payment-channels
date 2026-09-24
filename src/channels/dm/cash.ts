import { createCashPaymentChannel } from "../shared.js";

export const cashDmXcdPaymentChannel = createCashPaymentChannel({
  id: "cash_dm_xcd",
  country: "DM",
  currency: "XCD",
});
