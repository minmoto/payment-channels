import { createCashPaymentChannel } from "../shared.js";

export const cashWsWstPaymentChannel = createCashPaymentChannel({
  id: "cash_ws_wst",
  country: "WS",
  currency: "WST",
});
