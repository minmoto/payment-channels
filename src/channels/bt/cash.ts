import { createCashPaymentChannel } from "../shared.js";

export const cashBtBtnPaymentChannel = createCashPaymentChannel({
  id: "cash_bt_btn",
  country: "BT",
  currency: "BTN",
});
