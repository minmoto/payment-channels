import { createCashPaymentChannel } from "../shared.js";

export const cashVnVndPaymentChannel = createCashPaymentChannel({
  id: "cash_vn_vnd",
  country: "VN",
  currency: "VND",
});
