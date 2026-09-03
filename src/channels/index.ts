import type { PaymentChannelSchema } from "../core.js";

export { airtelMoneyKeKesPaymentChannel } from "./airtel_money_ke_kes.js";
export { airtelMoneyMwMwkPaymentChannel } from "./airtel_money_mw_mwk.js";
export { cashKeKesPaymentChannel } from "./cash_ke_kes.js";
export { mpesaPaybillKeKesPaymentChannel } from "./mpesa_paybill_ke_kes.js";
export { mpesaPhoneKeKesPaymentChannel } from "./mpesa_phone_ke_kes.js";
export { mpesaTillKeKesPaymentChannel } from "./mpesa_till_ke_kes.js";
export { payshapAccountZaZarPaymentChannel } from "./payshap_account_za_zar.js";
export { payshapShapidZaZarPaymentChannel } from "./payshap_shapid_za_zar.js";
export { tnmMpambaMwMwkPaymentChannel } from "./tnm_mpamba_mw_mwk.js";

import { airtelMoneyKeKesPaymentChannel } from "./airtel_money_ke_kes.js";
import { airtelMoneyMwMwkPaymentChannel } from "./airtel_money_mw_mwk.js";
import { cashKeKesPaymentChannel } from "./cash_ke_kes.js";
import { mpesaPaybillKeKesPaymentChannel } from "./mpesa_paybill_ke_kes.js";
import { mpesaPhoneKeKesPaymentChannel } from "./mpesa_phone_ke_kes.js";
import { mpesaTillKeKesPaymentChannel } from "./mpesa_till_ke_kes.js";
import { payshapAccountZaZarPaymentChannel } from "./payshap_account_za_zar.js";
import { payshapShapidZaZarPaymentChannel } from "./payshap_shapid_za_zar.js";
import { tnmMpambaMwMwkPaymentChannel } from "./tnm_mpamba_mw_mwk.js";

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
