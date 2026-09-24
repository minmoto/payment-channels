import { createCashPaymentChannel } from "../shared.js";

export const cashDoDopPaymentChannel = createCashPaymentChannel({
  id: "cash_do_dop",
  country: "DO",
  currency: "DOP",
});
