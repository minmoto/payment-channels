import { createCashPaymentChannel } from "../shared.js";

export const cashMnMntPaymentChannel = createCashPaymentChannel({
  id: "cash_mn_mnt",
  country: "MN",
  currency: "MNT",
});
