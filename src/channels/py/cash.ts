import { createCashPaymentChannel } from "../shared.js";

export const cashPyPygPaymentChannel = createCashPaymentChannel({
  id: "cash_py_pyg",
  country: "PY",
  currency: "PYG",
});
