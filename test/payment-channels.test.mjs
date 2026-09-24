import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import * as paymentChannels from "../dist/esm/index.js";
import {
  PaymentChannelAutomation,
  PaymentChannelGroup,
  builtinPaymentChannels,
  createPaymentChannelRegistry,
  definePaymentChannelSchema,
  listPaymentChannelSchemas,
  renderDetailRows,
  validatePaymentChannelData,
  createCashPaymentChannel,
} from "../dist/esm/index.js";

async function listChannelSourceFiles(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listChannelSourceFiles(entryPath)));
    } else if (entry.name.endsWith(".ts") && entry.name !== "index.ts" && entry.name !== "shared.ts") {
      files.push(entryPath);
    }
  }

  return files;
}

test("public contract excludes product workflow and actor metadata", () => {
  assert.equal("PaymentFlow" in paymentChannels, false);
  assert.equal("PaymentActor" in paymentChannels, false);
  for (const channel of builtinPaymentChannels) {
    assert.equal("flows" in channel.support, false);
    assert.equal("actors" in channel.support, false);
  }
});

test("registry exposes built-in KES mobile money channels", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "KES",
    country: "KE",
    group: PaymentChannelGroup.MobileMoney,
  });

  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["mpesa_phone_ke_kes", "mpesa_pochi_ke_kes", "mpesa_till_ke_kes", "mpesa_paybill_ke_kes", "airtel_money_ke_kes"],
  );
});

test("registry exposes built-in MWK mobile money channels", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "MWK",
    country: "MW",
    group: PaymentChannelGroup.MobileMoney,
  });

  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["airtel_money_mw_mwk", "airtel_money_till_mw_mwk", "tnm_mpamba_mw_mwk", "tnm_mpamba_merchant_mw_mwk"],
  );
});

test("registry exposes the built-in Ethiopian Telebirr channel", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "ETB",
    country: "ET",
    group: PaymentChannelGroup.MobileMoney,
  });
  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["telebirr_phone_et_etb"],
  );
});

test("Telebirr phone details are normalized and rendered", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "telebirr_phone_et_etb");
  assert.ok(schema);
  const validation = validatePaymentChannelData(schema, {
    phoneNumber: " +251912345678 ",
    description: " settlement ",
  });
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.data, { phoneNumber: "+251912345678", description: "settlement" });
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    { key: "phoneNumber", label: "Phone number", value: "+251***678", copyable: true, copyValue: "+251912345678" },
  ]);
});

test("Telebirr supports manual wallet transfer and Ethiopian phone formats", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "telebirr_phone_et_etb");
  assert.ok(schema);
  assert.equal(schema.support.automation, PaymentChannelAutomation.Manual);

  const validCases = [
    { input: "0912345678", expected: "+251912345678" },
    { input: "0712345678", expected: "+251712345678" },
    { input: "00251912345678", expected: "+251912345678" },
    { input: "00251712345678", expected: "+251712345678" },
    { input: "+251912345678", expected: "+251912345678" },
    { input: "+251712345678", expected: "+251712345678" },
  ];

  for (const { input, expected } of validCases) {
    const validation = validatePaymentChannelData(schema, { phoneNumber: input });
    assert.equal(validation.valid, true, input);
    assert.equal(validation.data.phoneNumber, expected);
  }
});

test("Telebirr rejects invalid Ethiopian phone numbers", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "telebirr_phone_et_etb");
  assert.ok(schema);

  for (const invalidNumber of ["+254712345678", "+251812345678", "0812345678", "12345"]) {
    const validation = validatePaymentChannelData(schema, { phoneNumber: invalidNumber });
    assert.equal(validation.valid, false, invalidNumber);
    assert.deepEqual(validation.issues, [
      {
        field: "phoneNumber",
        message: "Use an Ethiopian phone number in international format, e.g. +251912345678 or +251712345678",
      },
    ]);
  }
});

test("registry exposes the built-in ZAR PayShap bank channel", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "ZAR",
    country: "ZA",
    group: PaymentChannelGroup.Bank,
  });
  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["payshap_shapid_za_zar", "payshap_account_za_zar"],
  );
});

test("registry exposes the built-in Kenyan PesaLink bank channel", () => {
  const registry = createPaymentChannelRegistry();
  const channels = listPaymentChannelSchemas(registry, {
    currency: "KES",
    country: "KE",
    group: PaymentChannelGroup.Bank,
  });
  assert.deepEqual(
    channels.map((channel) => channel.id),
    ["pesalink_account_ke_kes"],
  );
});

test("PesaLink account details are normalized and rendered", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "pesalink_account_ke_kes");
  assert.ok(schema);
  const validation = validatePaymentChannelData(schema, {
    recipientName: " Jane Example ",
    bankName: " Example Bank ",
    accountNumber: " 1234567890 ",
  });
  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "recipientName",
      label: "Recipient name",
      value: "Jane Example",
      copyable: false,
    },
    { key: "bankName", label: "Bank", value: "Example Bank", copyable: false },
    {
      key: "accountNumber",
      label: "Account number",
      value: "******7890",
      copyable: true,
      copyValue: "1234567890",
    },
  ]);
});

test("PayShap account details are normalized and required", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_account_za_zar");
  assert.ok(schema);
  const valid = validatePaymentChannelData(schema, {
    recipientName: " Jane Example ",
    bankName: " Example Bank ",
    accountNumber: " 1234567890 ",
    description: " settlement ",
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.data, {
    recipientName: "Jane Example",
    bankName: "Example Bank",
    accountNumber: "1234567890",
    description: "settlement",
  });
  const invalid = validatePaymentChannelData(schema, {
    recipientName: "Jane Example",
    bankName: " ",
    accountNumber: "1234567890",
  });
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.issues, [{ field: "bankName", message: "Bank is required" }]);
});

test("PayShap trims and validates bank-qualified ShapIDs", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_shapid_za_zar");
  assert.ok(schema);
  const result = validatePaymentChannelData(schema, {
    shapId: " 0812345678@standardbank ",
    description: " settlement ",
  });
  assert.equal(result.valid, true);
  assert.equal(result.data.shapId, "0812345678@standardbank");
  assert.equal(result.data.description, "settlement");
});

test("PayShap rejects invalid ShapIDs", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "payshap_shapid_za_zar");
  assert.ok(schema);
  const result = validatePaymentChannelData(schema, { shapId: "not-a-shapid" });
  assert.equal(result.valid, false);
  assert.deepEqual(result.issues, [
    {
      field: "shapId",
      message: "Use a South African cellphone ShapID, e.g. 0812345678 or 0812345678@bank",
    },
  ]);
});

test("Pochi la Biashara normalizes and renders its business phone number", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_pochi_ke_kes");
  assert.ok(schema);
  assert.equal(schema.support.automation, PaymentChannelAutomation.Manual);

  const validation = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
    description: " market stall ",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.data, {
    phoneNumber: "+254712345678",
    description: "market stall",
  });
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "phoneNumber",
      label: "Business phone number",
      value: "+254***678",
      copyable: true,
      copyValue: "+254712345678",
    },
  ]);
});

test("Pochi la Biashara rejects invalid business phone numbers", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_pochi_ke_kes");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    phoneNumber: "12345",
  });

  assert.equal(validation.valid, false);
  assert.deepEqual(validation.issues, [
    {
      field: "phoneNumber",
      message: "Use a Kenyan phone number in international format, e.g. +254712345678",
    },
  ]);
});

test("phone fields normalize and validate against currency network rules", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone_ke_kes");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
    description: " settlement ",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.phoneNumber, "+254712345678");
  assert.equal(result.data.description, "settlement");
});

test("phone fields normalize international dialing prefixes", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone_ke_kes");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "00254 712 345 678",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.phoneNumber, "+254712345678");
});

test("invalid channel data returns field issues", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "tnm_mpamba_mw_mwk");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "+265991234567",
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.issues, [
    {
      field: "phoneNumber",
      message: "Use a TNM Malawi number, e.g. +265881234567",
    },
  ]);
});

test("Airtel Money till normalizes and renders its till number", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "airtel_money_till_mw_mwk");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    tillNumber: " 710300 ",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.data, { tillNumber: "710300" });
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "tillNumber",
      label: "Till number",
      value: "710300",
      copyable: true,
      copyValue: "710300",
    },
  ]);
});

test("Airtel Money till rejects an out-of-range till number", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "airtel_money_till_mw_mwk");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    tillNumber: "123",
  });

  assert.equal(validation.valid, false);
  assert.deepEqual(validation.issues, [
    {
      field: "tillNumber",
      message: "Use a 5-7 digit till number",
    },
  ]);
});

test("TNM Mpamba merchant normalizes and renders its merchant code", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "tnm_mpamba_merchant_mw_mwk");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    merchantCode: " 6003070 ",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.data, { merchantCode: "6003070" });
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "merchantCode",
      label: "Merchant code",
      value: "6003070",
      copyable: true,
      copyValue: "6003070",
    },
  ]);
});

test("TNM Mpamba merchant rejects an out-of-range merchant code", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "tnm_mpamba_merchant_mw_mwk");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    merchantCode: "12",
  });

  assert.equal(validation.valid, false);
  assert.deepEqual(validation.issues, [
    {
      field: "merchantCode",
      message: "Use a 5-7 digit merchant code",
    },
  ]);
});

test("detail rows mask display values while preserving copy values", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_phone_ke_kes");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "phoneNumber",
      label: "Phone number",
      value: "+254***678",
      copyable: true,
      copyValue: "+254712345678",
    },
  ]);
});

test("detail rows render copyable values from validated data", () => {
  const schema = builtinPaymentChannels.find((channel) => channel.id === "mpesa_paybill_ke_kes");
  assert.ok(schema);

  const validation = validatePaymentChannelData(schema, {
    paybillNumber: "123456",
    accountNumber: "ORDER-42",
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(renderDetailRows(schema, validation.data), [
    {
      key: "paybillNumber",
      label: "Paybill number",
      value: "123456",
      copyable: true,
      copyValue: "123456",
    },
    {
      key: "accountNumber",
      label: "Account number",
      value: "ORDER-42",
      copyable: true,
      copyValue: "ORDER-42",
    },
  ]);
});

test("cash is present but explicitly not automated", () => {
  const cash = builtinPaymentChannels.find((channel) => channel.id === "cash_ke_kes");
  assert.ok(cash);
  assert.equal(cash.display.group, PaymentChannelGroup.Cash);
  assert.equal(cash.support.automation, PaymentChannelAutomation.None);
  assert.deepEqual(cash.fields, []);
});

test("cash definition composes into another country and currency", () => {
  const cash = createCashPaymentChannel({
    id: "cash_mw_mwk",
    country: "MW",
    currency: "MWK",
  });
  assert.equal(cash.id, "cash_mw_mwk");
  assert.deepEqual(cash.network, {
    id: "cash",
    label: "Cash",
    country: "MW",
    currency: "MWK",
  });
  assert.equal(cash.support.automation, PaymentChannelAutomation.None);
  assert.deepEqual(cash.fields, []);
});

test("every represented country has a built-in cash channel", () => {
  assert.deepEqual(
    builtinPaymentChannels
      .filter((channel) => channel.display.group === PaymentChannelGroup.Cash)
      .map((channel) => channel.id),
    [
      "cash_ag_xcd",
      "cash_ai_xcd",
      "cash_ao_aoa",
      "cash_au_aud",
      "cash_as_usd",
      "cash_bf_xof",
      "cash_bi_bif",
      "cash_bj_xof",
      "cash_bl_eur",
      "cash_bm_bmd",
      "cash_ar_ars",
      "cash_bo_bob",
      "cash_br_brl",
      "cash_bw_bwp",
      "cash_ca_cad",
      "cash_cd_cdf",
      "cash_cf_xaf",
      "cash_cg_xaf",
      "cash_ci_xof",
      "cash_ck_nzd",
      "cash_cl_clp",
      "cash_cm_xaf",
      "cash_co_cop",
      "cash_cv_cve",
      "cash_dj_djf",
      "cash_dm_xcd",
      "cash_dz_dzd",
      "cash_ec_usd",
      "cash_eg_egp",
      "cash_eh_mad",
      "cash_er_ern",
      "cash_et_etb",
      "cash_fj_fjd",
      "cash_fm_usd",
      "cash_fk_fkp",
      "cash_ga_xaf",
      "cash_gb_gbp",
      "cash_gd_xcd",
      "cash_gf_eur",
      "cash_gh_ghs",
      "cash_gl_dkk",
      "cash_gm_gmd",
      "cash_gn_gnf",
      "cash_gp_eur",
      "cash_gq_xaf",
      "cash_gu_usd",
      "cash_gw_xof",
      "cash_gy_gyd",
      "cash_in_inr",
      "cash_ke_kes",
      "cash_ki_aud",
      "cash_km_kmf",
      "cash_kn_xcd",
      "cash_lc_xcd",
      "cash_lr_lrd",
      "cash_lr_usd",
      "cash_ls_lsl",
      "cash_ls_zar",
      "cash_ly_lyd",
      "cash_ma_mad",
      "cash_mf_eur",
      "cash_mg_mga",
      "cash_mh_usd",
      "cash_ml_xof",
      "cash_mp_usd",
      "cash_mq_eur",
      "cash_mr_mru",
      "cash_ms_xcd",
      "cash_mu_mur",
      "cash_mw_mwk",
      "cash_mz_mzn",
      "cash_na_nad",
      "cash_na_zar",
      "cash_nc_xpf",
      "cash_nf_aud",
      "cash_ne_xof",
      "cash_ng_ngn",
      "cash_nz_nzd",
      "cash_pk_pkr",
      "cash_pm_eur",
      "cash_pg_pgk",
      "cash_nr_aud",
      "cash_nu_nzd",
      "cash_pf_xpf",
      "cash_pn_nzd",
      "cash_pw_usd",
      "cash_pe_pen",
      "cash_py_pyg",
      "cash_re_eur",
      "cash_rw_rwf",
      "cash_sb_sbd",
      "cash_sc_scr",
      "cash_sd_sdg",
      "cash_sh_shp",
      "cash_sl_sle",
      "cash_sn_xof",
      "cash_so_sos",
      "cash_so_usd",
      "cash_sr_srd",
      "cash_ss_ssp",
      "cash_st_stn",
      "cash_sz_szl",
      "cash_sz_zar",
      "cash_td_xaf",
      "cash_tg_xof",
      "cash_tk_nzd",
      "cash_tn_tnd",
      "cash_to_top",
      "cash_tv_aud",
      "cash_tz_tzs",
      "cash_ug_ugx",
      "cash_vu_vuv",
      "cash_us_usd",
      "cash_wf_xpf",
      "cash_ws_wst",
      "cash_uy_uyu",
      "cash_vc_xcd",
      "cash_ve_ves",
      "cash_yt_eur",
      "cash_za_zar",
      "cash_zm_zmw",
      "cash_zw_usd",
      "cash_zw_zwg",
    ],
  );
});

test("registry exposes built-in cash channels for East African markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "BI", currency: "BIF", id: "cash_bi_bif" },
    { country: "DJ", currency: "DJF", id: "cash_dj_djf" },
    { country: "ER", currency: "ERN", id: "cash_er_ern" },
    { country: "ET", currency: "ETB", id: "cash_et_etb" },
    { country: "KE", currency: "KES", id: "cash_ke_kes" },
    { country: "KM", currency: "KMF", id: "cash_km_kmf" },
    { country: "MG", currency: "MGA", id: "cash_mg_mga" },
    { country: "RE", currency: "EUR", id: "cash_re_eur" },
    { country: "RW", currency: "RWF", id: "cash_rw_rwf" },
    { country: "SC", currency: "SCR", id: "cash_sc_scr" },
    { country: "SO", currency: "SOS", id: "cash_so_sos" },
    { country: "SO", currency: "USD", id: "cash_so_usd" },
    { country: "SS", currency: "SSP", id: "cash_ss_ssp" },
    { country: "TZ", currency: "TZS", id: "cash_tz_tzs" },
    { country: "UG", currency: "UGX", id: "cash_ug_ugx" },
    { country: "YT", currency: "EUR", id: "cash_yt_eur" },
    { country: "ZW", currency: "USD", id: "cash_zw_usd" },
    { country: "ZW", currency: "ZWG", id: "cash_zw_zwg" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for North African markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "DZ", currency: "DZD", id: "cash_dz_dzd" },
    { country: "EG", currency: "EGP", id: "cash_eg_egp" },
    { country: "EH", currency: "MAD", id: "cash_eh_mad" },
    { country: "LY", currency: "LYD", id: "cash_ly_lyd" },
    { country: "MA", currency: "MAD", id: "cash_ma_mad" },
    { country: "SD", currency: "SDG", id: "cash_sd_sdg" },
    { country: "TN", currency: "TND", id: "cash_tn_tnd" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for South African markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "AO", currency: "AOA", id: "cash_ao_aoa" },
    { country: "BW", currency: "BWP", id: "cash_bw_bwp" },
    { country: "LS", currency: "LSL", id: "cash_ls_lsl" },
    { country: "LS", currency: "ZAR", id: "cash_ls_zar" },
    { country: "MZ", currency: "MZN", id: "cash_mz_mzn" },
    { country: "NA", currency: "NAD", id: "cash_na_nad" },
    { country: "NA", currency: "ZAR", id: "cash_na_zar" },
    { country: "SZ", currency: "SZL", id: "cash_sz_szl" },
    { country: "SZ", currency: "ZAR", id: "cash_sz_zar" },
    { country: "ZM", currency: "ZMW", id: "cash_zm_zmw" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes dual cash channels for Common Monetary Area (CMA) markets", () => {
  const registry = createPaymentChannelRegistry();
  const cmaMarkets = [
    { country: "LS", expectedIds: ["cash_ls_lsl", "cash_ls_zar"] },
    { country: "NA", expectedIds: ["cash_na_nad", "cash_na_zar"] },
    { country: "SZ", expectedIds: ["cash_sz_szl", "cash_sz_zar"] },
  ];

  for (const { country, expectedIds } of cmaMarkets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      expectedIds,
    );
  }
});

test("registry exposes built-in cash channels for Central African markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "CD", currency: "CDF", id: "cash_cd_cdf" },
    { country: "CF", currency: "XAF", id: "cash_cf_xaf" },
    { country: "CG", currency: "XAF", id: "cash_cg_xaf" },
    { country: "CM", currency: "XAF", id: "cash_cm_xaf" },
    { country: "GA", currency: "XAF", id: "cash_ga_xaf" },
    { country: "GQ", currency: "XAF", id: "cash_gq_xaf" },
    { country: "ST", currency: "STN", id: "cash_st_stn" },
    { country: "TD", currency: "XAF", id: "cash_td_xaf" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for West African markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "BF", currency: "XOF", id: "cash_bf_xof" },
    { country: "BJ", currency: "XOF", id: "cash_bj_xof" },
    { country: "CI", currency: "XOF", id: "cash_ci_xof" },
    { country: "CV", currency: "CVE", id: "cash_cv_cve" },
    { country: "GH", currency: "GHS", id: "cash_gh_ghs" },
    { country: "GM", currency: "GMD", id: "cash_gm_gmd" },
    { country: "GN", currency: "GNF", id: "cash_gn_gnf" },
    { country: "GW", currency: "XOF", id: "cash_gw_xof" },
    { country: "LR", currency: "LRD", id: "cash_lr_lrd" },
    { country: "LR", currency: "USD", id: "cash_lr_usd" },
    { country: "ML", currency: "XOF", id: "cash_ml_xof" },
    { country: "MR", currency: "MRU", id: "cash_mr_mru" },
    { country: "NE", currency: "XOF", id: "cash_ne_xof" },
    { country: "SH", currency: "SHP", id: "cash_sh_shp" },
    { country: "SL", currency: "SLE", id: "cash_sl_sle" },
    { country: "SN", currency: "XOF", id: "cash_sn_xof" },
    { country: "TG", currency: "XOF", id: "cash_tg_xof" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for Oceania markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "AU", currency: "AUD", id: "cash_au_aud" },
    { country: "FJ", currency: "FJD", id: "cash_fj_fjd" },
    { country: "NC", currency: "XPF", id: "cash_nc_xpf" },
    { country: "NF", currency: "AUD", id: "cash_nf_aud" },
    { country: "NZ", currency: "NZD", id: "cash_nz_nzd" },
    { country: "PG", currency: "PGK", id: "cash_pg_pgk" },
    { country: "SB", currency: "SBD", id: "cash_sb_sbd" },
    { country: "VU", currency: "VUV", id: "cash_vu_vuv" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes dual cash channels for African multi-currency markets", () => {
  const registry = createPaymentChannelRegistry();
  const multiCurrencyMarkets = [
    { country: "LR", expectedIds: ["cash_lr_lrd", "cash_lr_usd"] },
    { country: "SO", expectedIds: ["cash_so_sos", "cash_so_usd"] },
    { country: "ZW", expectedIds: ["cash_zw_usd", "cash_zw_zwg"] },
  ];

  for (const { country, expectedIds } of multiCurrencyMarkets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      expectedIds,
    );
  }
});

test("registry exposes built-in cash channels for additional fiat currency markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "GB", currency: "GBP", id: "cash_gb_gbp" },
    { country: "IN", currency: "INR", id: "cash_in_inr" },
    { country: "MU", currency: "MUR", id: "cash_mu_mur" },
    { country: "NG", currency: "NGN", id: "cash_ng_ngn" },
    { country: "PK", currency: "PKR", id: "cash_pk_pkr" },
    { country: "US", currency: "USD", id: "cash_us_usd" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for Northern American markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "BM", currency: "BMD", id: "cash_bm_bmd" },
    { country: "CA", currency: "CAD", id: "cash_ca_cad" },
    { country: "GL", currency: "DKK", id: "cash_gl_dkk" },
    { country: "PM", currency: "EUR", id: "cash_pm_eur" },
    { country: "US", currency: "USD", id: "cash_us_usd" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for Micronesia and Polynesia markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "AS", currency: "USD", id: "cash_as_usd" },
    { country: "CK", currency: "NZD", id: "cash_ck_nzd" },
    { country: "FM", currency: "USD", id: "cash_fm_usd" },
    { country: "GU", currency: "USD", id: "cash_gu_usd" },
    { country: "KI", currency: "AUD", id: "cash_ki_aud" },
    { country: "MH", currency: "USD", id: "cash_mh_usd" },
    { country: "MP", currency: "USD", id: "cash_mp_usd" },
    { country: "NR", currency: "AUD", id: "cash_nr_aud" },
    { country: "NU", currency: "NZD", id: "cash_nu_nzd" },
    { country: "PF", currency: "XPF", id: "cash_pf_xpf" },
    { country: "PN", currency: "NZD", id: "cash_pn_nzd" },
    { country: "PW", currency: "USD", id: "cash_pw_usd" },
    { country: "TK", currency: "NZD", id: "cash_tk_nzd" },
    { country: "TO", currency: "TOP", id: "cash_to_top" },
    { country: "TV", currency: "AUD", id: "cash_tv_aud" },
    { country: "WF", currency: "XPF", id: "cash_wf_xpf" },
    { country: "WS", currency: "WST", id: "cash_ws_wst" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for South American markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "AR", currency: "ARS", id: "cash_ar_ars" },
    { country: "BO", currency: "BOB", id: "cash_bo_bob" },
    { country: "BR", currency: "BRL", id: "cash_br_brl" },
    { country: "CL", currency: "CLP", id: "cash_cl_clp" },
    { country: "CO", currency: "COP", id: "cash_co_cop" },
    { country: "EC", currency: "USD", id: "cash_ec_usd" },
    { country: "FK", currency: "FKP", id: "cash_fk_fkp" },
    { country: "GF", currency: "EUR", id: "cash_gf_eur" },
    { country: "GY", currency: "GYD", id: "cash_gy_gyd" },
    { country: "PE", currency: "PEN", id: "cash_pe_pen" },
    { country: "PY", currency: "PYG", id: "cash_py_pyg" },
    { country: "SR", currency: "SRD", id: "cash_sr_srd" },
    { country: "UY", currency: "UYU", id: "cash_uy_uyu" },
    { country: "VE", currency: "VES", id: "cash_ve_ves" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("registry exposes built-in cash channels for Eastern Caribbean and Eurozone Caribbean markets", () => {
  const registry = createPaymentChannelRegistry();
  const markets = [
    { country: "AG", currency: "XCD", id: "cash_ag_xcd" },
    { country: "AI", currency: "XCD", id: "cash_ai_xcd" },
    { country: "BL", currency: "EUR", id: "cash_bl_eur" },
    { country: "DM", currency: "XCD", id: "cash_dm_xcd" },
    { country: "GD", currency: "XCD", id: "cash_gd_xcd" },
    { country: "GP", currency: "EUR", id: "cash_gp_eur" },
    { country: "KN", currency: "XCD", id: "cash_kn_xcd" },
    { country: "LC", currency: "XCD", id: "cash_lc_xcd" },
    { country: "MF", currency: "EUR", id: "cash_mf_eur" },
    { country: "MQ", currency: "EUR", id: "cash_mq_eur" },
    { country: "MS", currency: "XCD", id: "cash_ms_xcd" },
    { country: "VC", currency: "XCD", id: "cash_vc_xcd" },
  ];

  for (const { country, currency, id } of markets) {
    const channels = listPaymentChannelSchemas(registry, {
      country,
      currency,
      group: PaymentChannelGroup.Cash,
    });
    assert.deepEqual(
      channels.map((channel) => channel.id),
      [id],
    );
  }
});

test("channel source files are grouped by country and match stable channel IDs", async () => {
  const channelsDirectory = fileURLToPath(new URL("../src/channels", import.meta.url));
  const filenames = await listChannelSourceFiles(channelsDirectory);

  assert.equal(filenames.length, builtinPaymentChannels.length);

  for (const filename of filenames) {
    const source = await readFile(filename, "utf8");
    const definitions = source.match(/(?:definePaymentChannelSchema\(\{|createCashPaymentChannel\(\{)/g) ?? [];
    const exports = [
      ...source.matchAll(
        /^export\s+const\s+(\w+)\s*=\s*(?:definePaymentChannelSchema\(\{\s*id:\s*"([^"]+)"|createCashPaymentChannel\(\{\s*id:\s*"([^"]+)")/gm,
      ),
    ];

    assert.equal(definitions.length, 1, `${filename} must define exactly one payment channel`);
    assert.equal(exports.length, 1, `${filename} must export its payment channel definition`);

    const channelId = exports[0][2] ?? exports[0][3];
    const channel = builtinPaymentChannels.find((candidate) => candidate.id === channelId);
    assert.ok(channel, `${filename} must define a built-in payment channel`);

    const country = channel.network.country.toLowerCase();
    const currency = channel.network.currency.toLowerCase();
    const marketSuffix = `_${country}_${currency}`;
    assert.ok(channel.id.endsWith(marketSuffix), `${channel.id} must end with ${marketSuffix}`);

    const shortId = channel.id.slice(0, -marketSuffix.length);
    const countryCashChannels = builtinPaymentChannels.filter(
      (candidate) =>
        candidate.display.group === PaymentChannelGroup.Cash && candidate.network.country.toLowerCase() === country,
    );
    const expectedFilename =
      channel.display.group === PaymentChannelGroup.Cash && countryCashChannels.length > 1
        ? `cash_${currency}.ts`
        : `${shortId}.ts`;
    const expectedPath = path.join(country, expectedFilename);
    assert.equal(path.relative(channelsDirectory, filename), expectedPath);
  }
});

test("public entry point re-exports every built-in payment channel constant", () => {
  const publicExports = new Set(Object.values(paymentChannels));

  for (const channel of builtinPaymentChannels) {
    assert.ok(publicExports.has(channel), `${channel.id} must be re-exported from src/index.ts`);
  }
});

test("schema definitions reject unsafe registry entries early", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: "broken",
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: {
          id: "broken",
          label: "Broken",
          country: "KE",
          currency: "KES",
        },
        support: {
          automation: PaymentChannelAutomation.Manual,
        },
        fields: [
          {
            key: "account",
            label: "Account",
            type: "text",
            required: true,
            validation: [{ kind: "pattern", pattern: "[" }],
          },
        ],
        detailRows: [],
      }),
    /Invalid validation pattern/,
  );
});

test("schema definitions reject invalid automation values early", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: "broken_automation",
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: {
          id: "broken",
          label: "Broken",
          country: "KE",
          currency: "KES",
        },
        support: {
          automation: /** @type {any} */ ("script"),
        },
        fields: [],
        detailRows: [],
      }),
    /Payment channel automation is invalid/,
  );
});

test("schema definitions reject missing detail rows early", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema(
        /** @type {any} */ ({
          id: "missing_detail_rows",
          version: 1,
          display: {
            label: "Broken",
            shortLabel: "Broken",
            description: "Invalid schema",
            icon: "broken",
            group: PaymentChannelGroup.MobileMoney,
          },
          network: {
            id: "broken",
            label: "Broken",
            country: "KE",
            currency: "KES",
          },
          support: {
            automation: PaymentChannelAutomation.Manual,
          },
          fields: [],
        }),
      ),
    /Payment channel schema missing detailRows/,
  );
});

test("schema definitions reject non-canonical channel identifiers", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: /** @type {any} */ ("Mpesa"),
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: {
          id: "broken",
          label: "Broken",
          country: /** @type {any} */ ("ke"),
          currency: "KES",
        },
        support: {
          automation: PaymentChannelAutomation.Manual,
        },
        fields: [],
        detailRows: [],
      }),
    /Payment channel schema id must be lowercase snake case/,
  );
});

test("schema definitions reject duplicate detail row keys", () => {
  assert.throws(
    () =>
      definePaymentChannelSchema({
        id: "duplicate_detail_rows",
        version: 1,
        display: {
          label: "Broken",
          shortLabel: "Broken",
          description: "Invalid schema",
          icon: "broken",
          group: PaymentChannelGroup.MobileMoney,
        },
        network: {
          id: "broken",
          label: "Broken",
          country: "KE",
          currency: "KES",
        },
        support: {
          automation: PaymentChannelAutomation.Manual,
        },
        fields: [
          {
            key: "account",
            label: "Account",
            type: "text",
            required: true,
          },
        ],
        detailRows: [
          { key: "account", label: "Account", fields: ["account"] },
          { key: "account", label: "Account copy", fields: ["account"] },
        ],
      }),
    /Duplicate detail row key/,
  );
});
