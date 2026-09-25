import { createCashPaymentChannel } from "../shared.js";

export const cashHuHufPaymentChannel = createCashPaymentChannel({
  id: "cash_hu_huf",
  country: "HU",
  currency: "HUF",
});
