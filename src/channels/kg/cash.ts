import { createCashPaymentChannel } from "../shared.js";

export const cashKgKgsPaymentChannel = createCashPaymentChannel({
  id: "cash_kg_kgs",
  country: "KG",
  currency: "KGS",
});
