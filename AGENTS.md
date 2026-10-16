# AGENTS.md

## Purpose

This repository publishes `@minmoto/payment-channels`, a small, dependency-free TypeScript library containing an open registry of fiat payment channel schemas.

The package describes how a channel is identified, displayed, collected, normalized, validated, and rendered. It does not move money, call a provider API, verify a transaction, or prove that a phone number belongs to a person.

This file governs contributors modifying the repository. The public consumer contract starts at `docs/README.md`; do not treat contributor workflow or release instructions as runtime API guidance.

## Repository map

- `src/core.ts` contains schema types, registry helpers, validators, and render helpers.
- `src/channels/<country>/` contains one built-in channel per source file, named `<network>_<variant?>.ts` (for example `src/channels/ke/mpesa_phone.ts`). Add a `_<currency>` suffix when a country has the same channel in more than one currency (for example `src/channels/zw/cash_usd.ts` and `cash_zwg.ts`).
- `src/channels/shared.ts` contains shared fields, evidence, and factories such as `createCashPaymentChannel`.
- `src/channels/index.ts` exports every channel and lists it in `builtinPaymentChannels`.
- `src/index.ts` is the public source module.
- `test/payment-channels.test.mjs` is the runtime contract test suite. Tests import compiled ESM output from `dist/esm`.
- `test/contribution-tooling.test.mjs` tests evidence validation and the generated coverage view.
- `test/payment-channels.cjs.test.cjs` is a CommonJS smoke test. It `require()`s compiled output from `dist/cjs` and checks it matches the ESM result for a shared fixture.
- `README.md` is the consumer-facing API and release documentation.
- `CHANGELOG.md` is generated per release from Conventional Commit messages.
- `RELEASING.md` documents release preparation, npm trusted publishing, and recovery.
- `package.json` and `package-lock.json` define the npm package and reproducible development dependencies.
- `tsconfig.json` is also the ESM build config (`dist/esm`); `tsconfig.cjs.json` extends it to build `dist/cjs`. `scripts/finalize-build.mjs` writes `dist/cjs/package.json` so Node treats that output as CommonJS.
- `scripts/verify-pack.mjs` packs the tarball and installs it into throwaway ESM and CommonJS consumer projects to check both module systems resolve the published package.
- `dist/` is generated output and must not be committed.

Contributor research, market review, and evidence records (`contributing/evidence.json`) are described in `CONTRIBUTING.md` and `contributing/review-guide.md`. Keep them separate from consumer documentation. `contributing/coverage.md` is generated and checked with the registry docs; do not hand-edit it or infer review status from implementation.

## Development commands

Use Node.js 18 or newer.

```sh
npm install
npm run format
npm run check
npm pack --dry-run
npm run verify:pack
```

`npm run format` applies Prettier to supported repository files. The installed pre-commit hook applies it to staged files and re-stages them; `npm run check` verifies formatting before TypeScript type checking, dual ESM/CJS compilation, and runtime tests. Run `npm test` when you only need the normal test path. A release candidate must also pass `npm pack --dry-run`, with package contents containing only the intended runtime artifacts, and `npm run verify:pack`, which installs the packed tarball into throwaway ESM and CommonJS consumer projects and checks both resolve the package and produce equivalent results. `verify:pack` is not part of `check`/`prepack` — it invokes `npm pack` itself, and `npm pack` always runs `prepack`, so nesting it inside `check` would recurse.

## Adding or changing a channel

1. Use `<network>_<variant?>_<country>_<currency>` for the stable lowercase channel ID, for example `mpesa_phone_ke_kes` in `src/channels/ke/mpesa_phone.ts`, exported as `mpesaPhoneKeKesPaymentChannel`. Once published, changing an ID or export name is a breaking change. Export the channel from `src/channels/index.ts` and `src/index.ts` and add it to `builtinPaymentChannels`.
2. For cash, use `createCashPaymentChannel` and add the ID to the cash inventory test; cash channels have no fields or detail rows.
3. Keep the network, country, and currency relationship explicit. Use ISO-style uppercase country and currency codes and a lowercase stable network ID.
4. Define every user-entered value as a field with a label, type, required flag, normalization rules, and serializable validation rules.
5. Add ordered detail rows for values that a consumer must display or copy after collection.
6. Add payer/payee instructions and evidence fields when the channel needs operational or reconciliation guidance.
7. Set `support.automation` to `api` only when a separate integration can actually perform the payout. A schema is not proof of provider capability.
8. Add or update tests for filtering, normalization, validation failures, and rendered details.
9. Update the README when the public API, built-in registry, supported runtime, or release process changes.

Do not put provider secrets, API calls, environment-specific URLs, executable callbacks, or non-serializable functions in a schema. Validation rules must remain portable across web, mobile, and server consumers.

## Compatibility and releases

The package follows semantic versioning. Additive schema fields and new built-in channel IDs are normally minor releases. Removing or renaming exported symbols, changing existing channel IDs, or changing validation/normalization behavior in a way that rejects previously accepted input is a breaking change. While the package is below `1.0.0`, Release Please advances the minor version for breaking changes; creating `1.0.0` requires a deliberate, reviewed release-policy change.

Use Conventional Commit subjects so Release Please can determine the next version and generate `CHANGELOG.md`. Review and merge its release pull request to create the tag, GitHub release, and npm publication. Do not manually edit released changelog entries or package versions; see `RELEASING.md` for the complete process.

Do not publish a package containing `dist` from a different source revision. The automated publish checks out the release SHA, and the `prepack` hook runs the full check suite before npm creates the tarball.

## Guidance for LLM contributors

Read the relevant source, tests, and README before editing. Preserve existing IDs and serialized enum values unless the task explicitly calls for a breaking change. Prefer a focused change over a broad redesign.

When adding a channel, distinguish documented network facts from assumptions. If a phone prefix, account format, or automation capability is uncertain, leave it out or record the uncertainty for human review rather than inventing validation. Never infer that a channel is safe to automate solely because it has a schema.

Before handing work back, report the files changed and the exact verification commands run. Do not commit generated `dist` files, lockfile churn unrelated to the dependency change, or credentials.

## Guidance for consumers

Treat registry entries as declarative product metadata. Filter by currency, country, and group before showing a channel. Map product workflows and application roles to approved channel IDs in the consuming application or provider integration. Validate and use `ValidationResult.data` as the normalized value; do not reimplement the same normalization in each UI.

Use `renderDetailRows` only for presentation and copy actions. Provider-side transaction status, recipient ownership, limits, fees, exchange rates, fraud controls, and settlement confirmation remain application or integration responsibilities. Keep sensitive field values out of logs and analytics.
