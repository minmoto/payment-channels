import { createCashPaymentChannel } from "../shared.js";

export const cashPgPgkPaymentChannel = createCashPaymentChannel({
  id: "cash_pg_pgk",
  country: "PG",
  currency: "PGK",
});
