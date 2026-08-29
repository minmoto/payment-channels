# @minmoto/payment-channels

An open, portable registry of fiat payment channel schemas for web, mobile, and server applications.

Each entry connects a payment method to a known money network, country, and fiat currency. It describes the fields a consumer should collect, how values are normalized and validated, what details should be displayed or copied, and what evidence or instructions support the workflow.

This package is a declarative contract. It does not move money, call payment providers, verify ownership, confirm settlement, or replace compliance and fraud controls.

## Install

```sh
npm install @minmoto/payment-channels
```

Node.js 18 or newer is supported. The package ships as tree-shakeable ESM with generated TypeScript declarations and has no runtime dependencies.

## Consumer example

```ts
import {
  createPaymentChannelRegistry,
  listPaymentChannelSchemas,
  validatePaymentChannelData,
} from "@minmoto/payment-channels";

const registry = createPaymentChannelRegistry();
const channels = listPaymentChannelSchemas(registry, {
  currency: "KES",
  country: "KE",
});

const mpesa = registry.get("mpesa_phone_ke_kes");
if (!mpesa) throw new Error("M-Pesa schema missing");

const result = validatePaymentChannelData(mpesa, {
  phoneNumber: "0712 345 678",
});

if (!result.valid) {
  // Render result.issues next to the corresponding fields.
  throw new Error("Invalid payment details");
}

// Use normalized values for the integration boundary.
result.data.phoneNumber; // "+254712345678"
```

`createPaymentChannelRegistry()` returns a fresh `Map`, so an application can add approved local schemas without mutating the built-in seed registry:

```ts
import {
  addPaymentChannelSchema,
  createPaymentChannelRegistry,
  definePaymentChannelSchema,
} from "@minmoto/payment-channels";

const registry = createPaymentChannelRegistry();
addPaymentChannelSchema(registry, definePaymentChannelSchema(myChannel));
```

## Schema contract

`PaymentChannelSchema` contains:

- `id` and `version`: stable identity and schema revision
- `display`: human-facing labels, description, icon token, and payment method group
- `network`: stable money network identity plus ISO-style country and currency codes
- `support`: visible actors and an explicit automation mode
- `fields`: typed inputs with required state, placeholders, normalization, masking, and serializable validation rules
- `detailRows`: ordered display and copy rows for collected payment details
- `instructions`: payer and payee guidance
- `evidence`: receipt or reconciliation fields

Validation rules are data, not callbacks. This keeps schemas serializable and safe to consume across different runtimes. The built-in helpers support pattern, minimum/maximum/exact length, and allow-list validation, plus trimming, digits-only, uppercase, and Kenya/Malawi E.164 phone normalization.

## Defining a channel

```ts
import {
  NormalizationKind,
  PaymentActor,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "@minmoto/payment-channels";

export const exampleWalletKeKes = definePaymentChannelSchema({
  id: "example_wallet_ke_kes",
  version: 1,
  display: {
    label: "Example Wallet",
    shortLabel: "Example",
    description: "Example mobile wallet transfer.",
    icon: "example-wallet",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: {
    id: "example_wallet",
    label: "Example Wallet",
    country: "KE",
    currency: "KES",
  },
  support: {
    actors: [PaymentActor.Agent, PaymentActor.Customer],
    automation: PaymentChannelAutomation.Manual,
  },
  fields: [
    {
      key: "phoneNumber",
      label: "Phone number",
      type: PaymentFieldType.Phone,
      required: true,
      placeholder: "+254700000000",
      normalize: [NormalizationKind.Trim],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^\\+254[0-9]{9}$",
          message: "Use a Kenyan phone number in international format",
        },
      ],
    },
  ],
  detailRows: [
    {
      key: "phoneNumber",
      label: "Phone number",
      fields: ["phoneNumber"],
      copyable: true,
    },
  ],
});
```

Use `definePaymentChannelSchema` at definition time. It rejects invalid IDs and code casing, invalid enum values, duplicate field or detail-row keys, malformed select fields, invalid regular expressions, invalid length rules, empty allow-lists, and detail rows that reference unknown fields.

Built-in IDs and source filenames use `<network>_<variant?>_<country>_<currency>`, with lowercase country and currency suffixes. For example, `mpesa_phone_ke_kes` is defined in `src/channels/mpesa_phone_ke_kes.ts`.

## Built-in registry

The seed registry currently includes:

- Kenya (`KES`): M-Pesa phone, M-Pesa till, M-Pesa paybill, Airtel Money, and cash
- Malawi (`MWK`): Airtel Money and TNM Mpamba

Cash is intentionally represented as a channel, but it has no structured payment fields and `automation: PaymentChannelAutomation.None`. A schema never implies that an external provider integration exists.

## Migration: product-owned workflow mapping

This breaking change removes the `PaymentFlow` export, `support.flows` schema field, and `flow` registry filter, and advances the built-in schema revisions to `2`. Collection, disbursement, exchange, settlement, and other product workflows now map to channel IDs outside this package, in application or provider configuration.

For example:

```ts
const channelsByWorkflow = {
  collection: ["mpesa_paybill_ke_kes", "mpesa_till_ke_kes"],
  disbursement: ["mpesa_phone_ke_kes", "airtel_money_ke_kes"],
} as const;

const configuredIds = new Set<string>(channelsByWorkflow.disbursement);
const configuredChannels = listPaymentChannelSchemas(registry, {
  country: "KE",
  currency: "KES",
}).filter((channel) => configuredIds.has(channel.id));
```

This mapping is product policy, not portable schema metadata. It can account for provider capabilities, commercial agreements, limits, and risk controls without changing a channel's fields or validation contract.

## Security and trust boundary

Payment details can contain personal or financial information. Consumers should mask sensitive fields in UI and keep raw values out of logs, analytics, URLs, and error reports. Validate again at the integration boundary and apply provider limits, authorization, rate limiting, compliance, and settlement verification there.

The registry is open for contribution, but a contributor-provided schema is not an authorization to send funds. Applications should allow-list the schemas and automation modes they have independently reviewed.

## Contributing and releasing

Contributor and LLM-agent instructions are in [`AGENTS.md`](./AGENTS.md). In a checkout of this repository:

```sh
npm install
npm run check
npm pack --dry-run
```

The project uses semantic versioning. Keep published channel IDs and serialized enum values stable. Add tests whenever a channel or validation rule changes.

`npm install` automatically configures the repository's `commit-msg` hook to reject non-Conventional Commit subjects. CI checks pull request commits as the authoritative enforcement, including when a local hook is bypassed.

Release Please derives versions and [`CHANGELOG.md`](./CHANGELOG.md) entries from Conventional Commit messages. The release pull request is the review point for each version's changelog; merging it creates the GitHub release and publishes the package to npm. See [`RELEASING.md`](./RELEASING.md) for setup and release instructions.

The package is MIT-licensed; see [`LICENSE`](./LICENSE).
