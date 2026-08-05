# AGENTS.md

## Purpose

This repository publishes `@minmoto/payment-channels`, a small, dependency-free TypeScript library containing an open registry of fiat payment channel schemas.

The package describes how a channel is identified, displayed, collected, normalized, validated, and rendered. It does not move money, call a provider API, verify a transaction, or prove that a phone number belongs to a person.

## Repository map

- `src/core.ts` contains schema types, registry helpers, validators, and render helpers.
- `src/channels/` contains one built-in channel per market-qualified source file.
- `src/index.ts` is the public source module.
- `test/payment-channels.test.mjs` is the runtime contract test suite. Tests import compiled output from `dist`.
- `README.md` is the consumer-facing API and release documentation.
- `package.json` and `package-lock.json` define the npm package and reproducible development dependencies.
- `dist/` is generated output and must not be committed.

## Development commands

Use Node.js 18 or newer.

```sh
npm install
npm run check
npm pack --dry-run
```

`npm run check` performs TypeScript type checking, compilation, and runtime tests. Run `npm test` when you only need the normal test path. A release candidate must also pass `npm pack --dry-run` and the package contents must contain only the intended runtime artifacts.

## Adding or changing a channel

1. Use `<network>_<variant?>_<country>_<currency>` for the stable lowercase channel ID and matching source filename, for example `mpesa_phone_ke_kes` in `mpesa_phone_ke_kes.ts`. Once published, changing an ID is a breaking change.
2. Keep the network, country, and currency relationship explicit. Use ISO-style uppercase country and currency codes and a lowercase stable network ID.
3. Define every user-entered value as a field with a label, type, required flag, normalization rules, and serializable validation rules.
4. Add ordered detail rows for values that a consumer must display or copy after collection.
5. Add payer/payee instructions and evidence fields when the channel needs operational or reconciliation guidance.
6. Set `support.automation` to `api` only when a separate integration can actually perform the payout. A schema is not proof of provider capability.
7. Add or update tests for filtering, normalization, validation failures, and rendered details.
8. Update the README when the public API, built-in registry, supported runtime, or release process changes.

Do not put provider secrets, API calls, environment-specific URLs, executable callbacks, or non-serializable functions in a schema. Validation rules must remain portable across web, mobile, and server consumers.

## Compatibility and releases

The package follows semantic versioning. Additive schema fields and new built-in channel IDs are normally minor releases. Removing or renaming exported symbols, changing existing channel IDs, or changing validation/normalization behavior in a way that rejects previously accepted input requires a major release unless explicitly documented otherwise.

Review the generated declaration file and `npm pack --dry-run` output before publishing. Publish from a clean, reviewed tag with:

```sh
npm publish --access public
```

Do not publish a package containing `dist` from a different source revision. The `prepack` hook runs the full check suite before npm creates the tarball.

## Guidance for LLM contributors

Read the relevant source, tests, and README before editing. Preserve existing IDs and serialized enum values unless the task explicitly calls for a breaking change. Prefer a focused change over a broad redesign.

When adding a channel, distinguish documented network facts from assumptions. If a phone prefix, account format, or automation capability is uncertain, leave it out or record the uncertainty for human review rather than inventing validation. Never infer that a channel is safe to automate solely because it has a schema.

Before handing work back, report the files changed and the exact verification commands run. Do not commit generated `dist` files, lockfile churn unrelated to the dependency change, or credentials.

## Guidance for consumers

Treat registry entries as declarative product metadata. Filter by currency, country, flow, actor, and group before showing a channel. Validate and use `ValidationResult.data` as the normalized value; do not reimplement the same normalization in each UI.

Use `renderDetailRows` only for presentation and copy actions. Provider-side transaction status, recipient ownership, limits, fees, exchange rates, fraud controls, and settlement confirmation remain application or integration responsibilities. Keep sensitive field values out of logs and analytics.
