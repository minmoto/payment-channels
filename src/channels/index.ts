import type { PaymentChannelSchema } from "../core.js";

export { airtelMoneyKeKesPaymentChannel } from "./ke/airtel_money.js";
export { cashKeKesPaymentChannel } from "./ke/cash.js";
export { mpesaPaybillKeKesPaymentChannel } from "./ke/mpesa_paybill.js";
export { mpesaPhoneKeKesPaymentChannel } from "./ke/mpesa_phone.js";
export { mpesaTillKeKesPaymentChannel } from "./ke/mpesa_till.js";
export { airtelMoneyMwMwkPaymentChannel } from "./mw/airtel_money.js";
export { tnmMpambaMwMwkPaymentChannel } from "./mw/tnm_mpamba.js";
export { payshapAccountZaZarPaymentChannel } from "./za/payshap_account.js";
export { payshapShapidZaZarPaymentChannel } from "./za/payshap_shapid.js";

import { airtelMoneyKeKesPaymentChannel } from "./ke/airtel_money.js";
import { cashKeKesPaymentChannel } from "./ke/cash.js";
import { mpesaPaybillKeKesPaymentChannel } from "./ke/mpesa_paybill.js";
import { mpesaPhoneKeKesPaymentChannel } from "./ke/mpesa_phone.js";
import { mpesaTillKeKesPaymentChannel } from "./ke/mpesa_till.js";
import { airtelMoneyMwMwkPaymentChannel } from "./mw/airtel_money.js";
import { tnmMpambaMwMwkPaymentChannel } from "./mw/tnm_mpamba.js";
import { payshapAccountZaZarPaymentChannel } from "./za/payshap_account.js";
import { payshapShapidZaZarPaymentChannel } from "./za/payshap_shapid.js";

export const builtinPaymentChannels: readonly PaymentChannelSchema[] = [
  mpesaPhoneKeKesPaymentChannel,
  mpesaTillKeKesPaymentChannel,
  mpesaPaybillKeKesPaymentChannel,
  airtelMoneyKeKesPaymentChannel,
  airtelMoneyMwMwkPaymentChannel,
  tnmMpambaMwMwkPaymentChannel,
  payshapShapidZaZarPaymentChannel,
  payshapAccountZaZarPaymentChannel,
  cashKeKesPaymentChannel,
];
