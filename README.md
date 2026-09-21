# @minmoto/payment-channels

An open, portable registry of fiat payment channel schemas for web, mobile, and server applications.

Each entry connects a payment method to a known money network, country, and fiat currency. It describes the fields a consumer should collect, how values are normalized and validated, what details should be displayed or copied, and what evidence or instructions support the workflow.

This package is a declarative contract. It does not move money, call payment providers, verify ownership, confirm settlement, or replace compliance and fraud controls.

## Install

```sh
npm install @minmoto/payment-channels
```

Node.js 18 or newer is supported. The package ships as tree-shakeable ESM and CommonJS builds with generated TypeScript declarations for each, and has no runtime dependencies.

## Module systems

The package publishes conditional exports so ESM, CommonJS, and TypeScript `Node16`/`NodeNext` consumers each resolve a matching build without custom path aliases or dynamic-import workarounds.

ESM:

```ts
import { createPaymentChannelRegistry, validatePaymentChannelData } from "@minmoto/payment-channels";
```

CommonJS:

```js
const { createPaymentChannelRegistry, validatePaymentChannelData } = require("@minmoto/payment-channels");
```

Both entry points expose the same public symbols, schema data, and validation behavior. `require()` resolves and runs synchronously, so a CommonJS or Node16-targeted application (for example a Next.js or NestJS project) can depend on this package without switching module systems or falling back to `import()`.

## Quick start

```ts
import {
  createPaymentChannelRegistry,
  getPaymentChannelSchema,
  listPaymentChannelSchemas,
  renderDetailRows,
  validatePaymentChannelData,
} from "@minmoto/payment-channels";

const registry = createPaymentChannelRegistry();
const available = listPaymentChannelSchemas(registry, {
  country: configuredCountry,
  currency: configuredCurrency,
});

// Product policy chooses from independently reviewed channel IDs.
const schema = getPaymentChannelSchema(registry, approvedChannelId);
if (!schema || !available.some(({ id }) => id === schema.id)) {
  throw new Error("Payment channel is not available for this market");
}

// Render inputs from schema.fields, then validate the submitted values.
const result = validatePaymentChannelData(schema, submittedValues);

if (!result.valid) {
  showFieldErrors(result.issues);
} else {
  // Pass normalized values to the integration boundary.
  submitPaymentDetails(result.data);
  showPaymentDetails(renderDetailRows(schema, result.data));
}
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

For deterministic consumer guidance, see the [documentation map](./docs/README.md), [agent contract](./docs/agent-contract.md), and [schema reference](./docs/schema-reference.md). A complete executable example is in [examples/generic-consumer.mjs](./examples/generic-consumer.mjs).

`PaymentChannelSchema` contains:

- `id` and `version`: stable identity and schema revision
- `display`: human-facing labels, description, icon token, and payment method group
- `network`: stable money network identity plus ISO-style country and currency codes
- `support`: an explicit automation mode
- `fields`: typed inputs with required state, placeholders, normalization, masking, and serializable validation rules
- `detailRows`: ordered display and copy rows for collected payment details
- `instructions`: payer and payee guidance
- `evidence`: receipt or reconciliation fields

Validation rules are data, not callbacks. This keeps schemas serializable and safe to consume across different runtimes. The built-in helpers support pattern, minimum/maximum/exact length, and allow-list validation, plus the normalization and masking strategies described in the schema reference.

## Defining a channel

```ts
import {
  MaskingKind,
  NormalizationKind,
  PaymentChannelAutomation,
  PaymentChannelGroup,
  PaymentFieldType,
  ValidationRuleKind,
  definePaymentChannelSchema,
} from "@minmoto/payment-channels";

// XZ is user-assigned and XTS is reserved for testing.
export const exampleWalletXzXts = definePaymentChannelSchema({
  id: "example_wallet_xz_xts",
  version: 1,
  display: {
    label: "Example Wallet",
    shortLabel: "Example",
    description: "Fictional wallet for an integration example.",
    icon: "example-wallet",
    group: PaymentChannelGroup.MobileMoney,
  },
  network: {
    id: "example_wallet",
    label: "Example Wallet",
    country: "XZ",
    currency: "XTS",
  },
  support: {
    automation: PaymentChannelAutomation.Manual,
  },
  fields: [
    {
      key: "accountCode",
      label: "Account code",
      type: PaymentFieldType.Text,
      required: true,
      placeholder: "AB-1234",
      sensitive: true,
      mask: MaskingKind.Last4,
      normalize: [NormalizationKind.Trim, NormalizationKind.Uppercase],
      validation: [
        {
          kind: ValidationRuleKind.Pattern,
          pattern: "^[A-Z]{2}-[0-9]{4}$",
          message: "Use two letters, a hyphen, and four digits",
        },
      ],
    },
  ],
  detailRows: [
    {
      key: "accountCode",
      label: "Account code",
      fields: ["accountCode"],
      copyable: true,
    },
  ],
});
```

Use `definePaymentChannelSchema` at definition time. It rejects invalid IDs and code casing, invalid enum values, duplicate field or detail-row keys, malformed select fields, invalid regular expressions, invalid length rules, empty allow-lists, and detail rows that reference unknown fields.

Built-in IDs use `<network>_<variant?>_<country>_<currency>`, with lowercase country and currency suffixes. Source files are grouped by country and omit the redundant market suffix: `src/channels/<country>/<network>_<variant?>.ts`. Country and currency remain explicit schema attributes even though currency is not repeated in the source path.

## Built-in registry

Discover current built-ins at runtime with `createPaymentChannelRegistry()` and `listPaymentChannelSchemas()`. Do not copy a channel catalog into application code or documentation. The repository publishes [machine-readable JSON](./docs/generated/registry.json) and a [generated human-readable inventory](./docs/generated/built-in-channels.md) for inspection; both are derived from `builtinPaymentChannels` and checked for drift by `npm run check`.

Cash is intentionally represented as a channel, but it has no structured payment fields and `automation: PaymentChannelAutomation.None`. A schema never implies that an external provider integration exists.

## Product-owned workflow and role mapping

This breaking change removes the `PaymentFlow` and `PaymentActor` exports, the `support.flows` and `support.actors` schema fields, and the `flow` and `actor` registry filters. The built-in schema revisions remain at `2`. Collection, disbursement, exchange, settlement, product roles, and permissions now map to channel IDs outside this package, in application or provider configuration.

For example:

```ts
const workflowIds = new Set<string>(applicationConfig.channelsByWorkflow.disbursement);
const roleIds = new Set<string>(applicationConfig.channelsByRole.operator);
const configuredChannels = listPaymentChannelSchemas(registry, {
  country: applicationConfig.country,
  currency: applicationConfig.currency,
}).filter((channel) => workflowIds.has(channel.id) && roleIds.has(channel.id));
```

These mappings are product policy, not portable schema metadata. They can account for provider capabilities, commercial agreements, authorization, limits, and risk controls without changing a channel's fields or validation contract. Transaction-relative payer and payee instructions remain in the schema because they describe how to use the payment method rather than who may access it.

## Security and trust boundary

Payment details can contain personal or financial information. Consumers should mask sensitive fields in UI and keep raw values out of logs, analytics, URLs, and error reports. Validate again at the integration boundary and apply provider limits, authorization, rate limiting, compliance, and settlement verification there.

The registry is open for contribution, but a contributor-provided schema is not an authorization to send funds. Applications should allow-list the schemas and automation modes they have independently reviewed.

## Contributing and releasing

Contributor and LLM-agent instructions are in [`AGENTS.md`](./AGENTS.md). In a checkout of this repository:

```sh
npm install
npm run check
npm pack --dry-run
npm run verify:pack
```

The project uses semantic versioning. Keep published channel IDs and serialized enum values stable. Add tests whenever a channel or validation rule changes.

`npm install` automatically configures the repository's `commit-msg` hook to reject non-Conventional Commit subjects. CI checks pull request commits as the authoritative enforcement, including when a local hook is bypassed.

Release Please derives versions and [`CHANGELOG.md`](./CHANGELOG.md) entries from Conventional Commit messages. The release pull request is the review point for each version's changelog; merging it creates the GitHub release and publishes the package to npm. See [`RELEASING.md`](./RELEASING.md) for setup and release instructions.

The package is MIT-licensed; see [`LICENSE`](./LICENSE).
