import type { PaymentChannelSchema } from "../core.js";

export { createCashPaymentChannel } from "./shared.js";

export { cashAoAoaPaymentChannel } from "./ao/cash.js";
export { cashBfXofPaymentChannel } from "./bf/cash.js";
export { cashBiBifPaymentChannel } from "./bi/cash.js";
export { cashBjXofPaymentChannel } from "./bj/cash.js";
export { cashBwBwpPaymentChannel } from "./bw/cash.js";
export { cashCdCdfPaymentChannel } from "./cd/cash.js";
export { cashCfXafPaymentChannel } from "./cf/cash.js";
export { cashCgXafPaymentChannel } from "./cg/cash.js";
export { cashCiXofPaymentChannel } from "./ci/cash.js";
export { cashCmXafPaymentChannel } from "./cm/cash.js";
export { cashCvCvePaymentChannel } from "./cv/cash.js";
export { cashDjDjfPaymentChannel } from "./dj/cash.js";
export { cashDzDzdPaymentChannel } from "./dz/cash.js";
export { cashEgEgpPaymentChannel } from "./eg/cash.js";
export { cashEhMadPaymentChannel } from "./eh/cash.js";
export { cashErErnPaymentChannel } from "./er/cash.js";
export { cashEtEtbPaymentChannel } from "./et/cash.js";
export { cashGaXafPaymentChannel } from "./ga/cash.js";
export { cashGbGbpPaymentChannel } from "./gb/cash.js";
export { cashGhGhsPaymentChannel } from "./gh/cash.js";
export { cashGmGmdPaymentChannel } from "./gm/cash.js";
export { cashGnGnfPaymentChannel } from "./gn/cash.js";
export { cashGqXafPaymentChannel } from "./gq/cash.js";
export { cashGwXofPaymentChannel } from "./gw/cash.js";
export { cashInInrPaymentChannel } from "./in/cash.js";
export { airtelMoneyKeKesPaymentChannel } from "./ke/airtel_money.js";
export { cashKeKesPaymentChannel } from "./ke/cash.js";
export { mpesaPaybillKeKesPaymentChannel } from "./ke/mpesa_paybill.js";
export { mpesaPhoneKeKesPaymentChannel } from "./ke/mpesa_phone.js";
export { mpesaPochiKeKesPaymentChannel } from "./ke/mpesa_pochi.js";
export { mpesaTillKeKesPaymentChannel } from "./ke/mpesa_till.js";
export { pesalinkAccountKeKesPaymentChannel } from "./ke/pesalink_account.js";
export { cashKmKmfPaymentChannel } from "./km/cash.js";
export { cashLrLrdPaymentChannel } from "./lr/cash.js";
export { cashLsLslPaymentChannel } from "./ls/cash.js";
export { cashLyLydPaymentChannel } from "./ly/cash.js";
export { cashMaMadPaymentChannel } from "./ma/cash.js";
export { cashMgMgaPaymentChannel } from "./mg/cash.js";
export { cashMlXofPaymentChannel } from "./ml/cash.js";
export { cashMrMruPaymentChannel } from "./mr/cash.js";
export { cashMuMurPaymentChannel } from "./mu/cash.js";
export { airtelMoneyMwMwkPaymentChannel } from "./mw/airtel_money.js";
export { airtelMoneyTillMwMwkPaymentChannel } from "./mw/airtel_money_till.js";
export { cashMwMwkPaymentChannel } from "./mw/cash.js";
export { tnmMpambaMwMwkPaymentChannel } from "./mw/tnm_mpamba.js";
export { tnmMpambaMerchantMwMwkPaymentChannel } from "./mw/tnm_mpamba_merchant.js";
export { cashMzMznPaymentChannel } from "./mz/cash.js";
export { cashNaNadPaymentChannel } from "./na/cash.js";
export { cashNeXofPaymentChannel } from "./ne/cash.js";
export { cashNgNgnPaymentChannel } from "./ng/cash.js";
export { cashPkPkrPaymentChannel } from "./pk/cash.js";
export { cashReEurPaymentChannel } from "./re/cash.js";
export { cashRwRwfPaymentChannel } from "./rw/cash.js";
export { cashScScrPaymentChannel } from "./sc/cash.js";
export { cashSdSdgPaymentChannel } from "./sd/cash.js";
export { cashShShpPaymentChannel } from "./sh/cash.js";
export { cashSlSlePaymentChannel } from "./sl/cash.js";
export { cashSnXofPaymentChannel } from "./sn/cash.js";
export { cashSoSosPaymentChannel } from "./so/cash.js";
export { cashSsSspPaymentChannel } from "./ss/cash.js";
export { cashStStnPaymentChannel } from "./st/cash.js";
export { cashSzSzlPaymentChannel } from "./sz/cash.js";
export { cashTdXafPaymentChannel } from "./td/cash.js";
export { cashTgXofPaymentChannel } from "./tg/cash.js";
export { cashTnTndPaymentChannel } from "./tn/cash.js";
export { cashTzTzsPaymentChannel } from "./tz/cash.js";
export { cashUgUgxPaymentChannel } from "./ug/cash.js";
export { cashUsUsdPaymentChannel } from "./us/cash.js";
export { cashYtEurPaymentChannel } from "./yt/cash.js";
export { cashZaZarPaymentChannel } from "./za/cash.js";
export { payshapAccountZaZarPaymentChannel } from "./za/payshap_account.js";
export { payshapShapidZaZarPaymentChannel } from "./za/payshap_shapid.js";
export { cashZmZmwPaymentChannel } from "./zm/cash.js";
export { cashZwZwgPaymentChannel } from "./zw/cash.js";

import { cashAoAoaPaymentChannel } from "./ao/cash.js";
import { cashBfXofPaymentChannel } from "./bf/cash.js";
import { cashBiBifPaymentChannel } from "./bi/cash.js";
import { cashBjXofPaymentChannel } from "./bj/cash.js";
import { cashBwBwpPaymentChannel } from "./bw/cash.js";
import { cashCdCdfPaymentChannel } from "./cd/cash.js";
import { cashCfXafPaymentChannel } from "./cf/cash.js";
import { cashCgXafPaymentChannel } from "./cg/cash.js";
import { cashCiXofPaymentChannel } from "./ci/cash.js";
import { cashCmXafPaymentChannel } from "./cm/cash.js";
import { cashCvCvePaymentChannel } from "./cv/cash.js";
import { cashDjDjfPaymentChannel } from "./dj/cash.js";
import { cashDzDzdPaymentChannel } from "./dz/cash.js";
import { cashEgEgpPaymentChannel } from "./eg/cash.js";
import { cashEhMadPaymentChannel } from "./eh/cash.js";
import { cashErErnPaymentChannel } from "./er/cash.js";
import { cashEtEtbPaymentChannel } from "./et/cash.js";
import { cashGaXafPaymentChannel } from "./ga/cash.js";
import { cashGbGbpPaymentChannel } from "./gb/cash.js";
import { cashGhGhsPaymentChannel } from "./gh/cash.js";
import { cashGmGmdPaymentChannel } from "./gm/cash.js";
import { cashGnGnfPaymentChannel } from "./gn/cash.js";
import { cashGqXafPaymentChannel } from "./gq/cash.js";
import { cashGwXofPaymentChannel } from "./gw/cash.js";
import { cashInInrPaymentChannel } from "./in/cash.js";
import { airtelMoneyKeKesPaymentChannel } from "./ke/airtel_money.js";
import { cashKeKesPaymentChannel } from "./ke/cash.js";
import { mpesaPaybillKeKesPaymentChannel } from "./ke/mpesa_paybill.js";
import { mpesaPhoneKeKesPaymentChannel } from "./ke/mpesa_phone.js";
import { mpesaPochiKeKesPaymentChannel } from "./ke/mpesa_pochi.js";
import { mpesaTillKeKesPaymentChannel } from "./ke/mpesa_till.js";
import { pesalinkAccountKeKesPaymentChannel } from "./ke/pesalink_account.js";
import { cashKmKmfPaymentChannel } from "./km/cash.js";
import { cashLrLrdPaymentChannel } from "./lr/cash.js";
import { cashLsLslPaymentChannel } from "./ls/cash.js";
import { cashLyLydPaymentChannel } from "./ly/cash.js";
import { cashMaMadPaymentChannel } from "./ma/cash.js";
import { cashMgMgaPaymentChannel } from "./mg/cash.js";
import { cashMlXofPaymentChannel } from "./ml/cash.js";
import { cashMrMruPaymentChannel } from "./mr/cash.js";
import { cashMuMurPaymentChannel } from "./mu/cash.js";
import { airtelMoneyMwMwkPaymentChannel } from "./mw/airtel_money.js";
import { airtelMoneyTillMwMwkPaymentChannel } from "./mw/airtel_money_till.js";
import { cashMwMwkPaymentChannel } from "./mw/cash.js";
import { tnmMpambaMwMwkPaymentChannel } from "./mw/tnm_mpamba.js";
import { tnmMpambaMerchantMwMwkPaymentChannel } from "./mw/tnm_mpamba_merchant.js";
import { cashMzMznPaymentChannel } from "./mz/cash.js";
import { cashNaNadPaymentChannel } from "./na/cash.js";
import { cashNeXofPaymentChannel } from "./ne/cash.js";
import { cashNgNgnPaymentChannel } from "./ng/cash.js";
import { cashPkPkrPaymentChannel } from "./pk/cash.js";
import { cashReEurPaymentChannel } from "./re/cash.js";
import { cashRwRwfPaymentChannel } from "./rw/cash.js";
import { cashScScrPaymentChannel } from "./sc/cash.js";
import { cashSdSdgPaymentChannel } from "./sd/cash.js";
import { cashShShpPaymentChannel } from "./sh/cash.js";
import { cashSlSlePaymentChannel } from "./sl/cash.js";
import { cashSnXofPaymentChannel } from "./sn/cash.js";
import { cashSoSosPaymentChannel } from "./so/cash.js";
import { cashSsSspPaymentChannel } from "./ss/cash.js";
import { cashStStnPaymentChannel } from "./st/cash.js";
import { cashSzSzlPaymentChannel } from "./sz/cash.js";
import { cashTdXafPaymentChannel } from "./td/cash.js";
import { cashTgXofPaymentChannel } from "./tg/cash.js";
import { cashTnTndPaymentChannel } from "./tn/cash.js";
import { cashTzTzsPaymentChannel } from "./tz/cash.js";
import { cashUgUgxPaymentChannel } from "./ug/cash.js";
import { cashUsUsdPaymentChannel } from "./us/cash.js";
import { cashYtEurPaymentChannel } from "./yt/cash.js";
import { cashZaZarPaymentChannel } from "./za/cash.js";
import { payshapAccountZaZarPaymentChannel } from "./za/payshap_account.js";
import { payshapShapidZaZarPaymentChannel } from "./za/payshap_shapid.js";
import { cashZmZmwPaymentChannel } from "./zm/cash.js";
import { cashZwZwgPaymentChannel } from "./zw/cash.js";

export const builtinPaymentChannels: readonly PaymentChannelSchema[] = [
  cashAoAoaPaymentChannel,
  cashBfXofPaymentChannel,
  cashBiBifPaymentChannel,
  cashBjXofPaymentChannel,
  cashBwBwpPaymentChannel,
  cashCdCdfPaymentChannel,
  cashCfXafPaymentChannel,
  cashCgXafPaymentChannel,
  cashCiXofPaymentChannel,
  cashCmXafPaymentChannel,
  cashCvCvePaymentChannel,
  cashDjDjfPaymentChannel,
  cashDzDzdPaymentChannel,
  cashEgEgpPaymentChannel,
  cashEhMadPaymentChannel,
  cashErErnPaymentChannel,
  cashEtEtbPaymentChannel,
  cashGaXafPaymentChannel,
  cashGbGbpPaymentChannel,
  cashGhGhsPaymentChannel,
  cashGmGmdPaymentChannel,
  cashGnGnfPaymentChannel,
  cashGqXafPaymentChannel,
  cashGwXofPaymentChannel,
  cashInInrPaymentChannel,
  mpesaPhoneKeKesPaymentChannel,
  mpesaPochiKeKesPaymentChannel,
  mpesaTillKeKesPaymentChannel,
  mpesaPaybillKeKesPaymentChannel,
  pesalinkAccountKeKesPaymentChannel,
  airtelMoneyKeKesPaymentChannel,
  cashKeKesPaymentChannel,
  cashKmKmfPaymentChannel,
  cashLrLrdPaymentChannel,
  cashLsLslPaymentChannel,
  cashLyLydPaymentChannel,
  cashMaMadPaymentChannel,
  cashMgMgaPaymentChannel,
  cashMlXofPaymentChannel,
  cashMrMruPaymentChannel,
  cashMuMurPaymentChannel,
  airtelMoneyMwMwkPaymentChannel,
  airtelMoneyTillMwMwkPaymentChannel,
  cashMwMwkPaymentChannel,
  tnmMpambaMwMwkPaymentChannel,
  tnmMpambaMerchantMwMwkPaymentChannel,
  cashMzMznPaymentChannel,
  cashNaNadPaymentChannel,
  cashNeXofPaymentChannel,
  cashNgNgnPaymentChannel,
  cashPkPkrPaymentChannel,
  cashReEurPaymentChannel,
  cashRwRwfPaymentChannel,
  cashScScrPaymentChannel,
  cashSdSdgPaymentChannel,
  cashShShpPaymentChannel,
  cashSlSlePaymentChannel,
  cashSnXofPaymentChannel,
  cashSoSosPaymentChannel,
  cashSsSspPaymentChannel,
  cashStStnPaymentChannel,
  cashSzSzlPaymentChannel,
  cashTdXafPaymentChannel,
  cashTgXofPaymentChannel,
  cashTnTndPaymentChannel,
  cashTzTzsPaymentChannel,
  cashUgUgxPaymentChannel,
  cashUsUsdPaymentChannel,
  cashYtEurPaymentChannel,
  payshapShapidZaZarPaymentChannel,
  payshapAccountZaZarPaymentChannel,
  cashZaZarPaymentChannel,
  cashZmZmwPaymentChannel,
  cashZwZwgPaymentChannel,
];
