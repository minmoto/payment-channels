import { createCashPaymentChannel } from "../shared.js";

export const cashShShpPaymentChannel = createCashPaymentChannel({
  id: "cash_sh_shp",
  country: "SH",
  currency: "SHP",
});
