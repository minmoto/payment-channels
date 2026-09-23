import { createCashPaymentChannel } from "../shared.js";

export const cashKmKmfPaymentChannel = createCashPaymentChannel({
  id: "cash_km_kmf",
  country: "KM",
  currency: "KMF",
});
