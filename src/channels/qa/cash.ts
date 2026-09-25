import { createCashPaymentChannel } from "../shared.js";

export const cashQaQarPaymentChannel = createCashPaymentChannel({
  id: "cash_qa_qar",
  country: "QA",
  currency: "QAR",
});
