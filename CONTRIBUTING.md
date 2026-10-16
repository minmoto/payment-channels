# Contribute local payment knowledge

Help applications collect payment details correctly in your market. You can contribute research or review without writing code. Start with one country, currency, and payment network; a complete country catalog is not required for a first contribution.

## Choose a contribution

| Path                  | What to contribute                                                                                         | Start here                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Describe a channel    | Required recipient details, fictional examples, instructions, official sources, and what remains uncertain | [Propose a channel](https://github.com/minmoto/payment-channels/issues/new?template=channel-proposal.yml)                    |
| Review local accuracy | Check a bounded set of fields or currency pairs against your experience and current sources                | [Submit a market review](https://github.com/minmoto/payment-channels/issues/new?template=market-review.yml)                  |
| Report a correction   | Identify an outdated currency, field, normalization rule, or instruction                                   | [Report outdated information](https://github.com/minmoto/payment-channels/issues/new?template=channel-correction.yml)        |
| Implement a schema    | Turn accepted evidence into a small, tested TypeScript change                                              | [Implementation tasks](https://github.com/minmoto/payment-channels/issues?q=is%3Aissue%20is%3Aopen%20label%3Aimplementation) |

Plain language and sources in local languages are welcome. Include a short explanation or translation of the relevant passage when possible. Write “unknown” where evidence is missing. Maintainers can help turn a researched description into code.

Use invented examples. Do not post personal payment details, receipts identifying a person, credentials, or provider secrets. This project describes payment channels; it does not operate them or establish provider availability.

## Pick a small task

Check the [coverage and evidence matrix](contributing/coverage.md) and [open contribution tasks](https://github.com/minmoto/payment-channels/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22help%20wanted%22). Comment with the exact channel or question you will work on to avoid duplication. A claim is not a permanent reservation; let others know when you stop working on it.

Issues [#20](https://github.com/minmoto/payment-channels/issues/20), [#21](https://github.com/minmoto/payment-channels/issues/21), and [#29](https://github.com/minmoto/payment-channels/issues/29) track broader goals. A child task should cover one network, a small market batch, or a specific evidence gap, with a clear completion criterion. Closing a child task does not complete its umbrella issue.

For research, supply:

- Country/territory, currency, network, and intended channel variant.
- Recipient fields, required/optional state, fictional examples, normalization, and documented validation. A provider's internal requirement may differ from the network standard; identify the scope.
- Payer/payee instructions and evidence needed for reconciliation, where relevant.
- Direct authoritative source links, the claim each supports, and the date checked. Local-language sources are useful evidence.
- Practical uncertainties, exclusions, and your experience with the market. Distinguish cash circulation from a peg or exchangeability.

See the [review guide](contributing/review-guide.md) for evidence decisions and how to record a review. Research, market review, translation, and implementation are all [recognized contributions](CONTRIBUTORS.md).

## Implement accepted evidence

Read [AGENTS.md](AGENTS.md), the relevant source and tests, and the public [schema reference](docs/schema-reference.md). Keep IDs and serialized values stable. New validation that rejects previously accepted input can be breaking; report this in the PR. Do not edit package versions or released changelog entries.

For an accepted cash pair, add `src/channels/<country>/cash.ts` with `createCashPaymentChannel` from `src/channels/shared.ts` (see `src/channels/ke/cash.ts`). If the country already has a cash channel, name both files `cash_<currency>.ts` (see `src/channels/zw/`) without changing existing IDs or export names. Export it from `src/channels/index.ts` and `src/index.ts`, add it to `builtinPaymentChannels`, and add its ID to the cash inventory test. Non-cash channels require a deliberately authored schema using the README example and shared helpers.

Update the source records in [contributing/evidence.json](contributing/evidence.json), then run:

```sh
npm ci
npm run docs:generate
npm run format
npm run check
npm pack --dry-run
npm run verify:pack
git diff --check
```

Generated registry and coverage files must be regenerated, not hand-edited. Do not commit `dist/`. Keep unrelated lockfile changes out of the PR. Use a Conventional Commit subject such as `feat(channels): add ...` or `docs: record ...`. Link the bounded task, describe compatibility implications, report commands actually run, and credit research and review in the PR.

Contributor tooling lives in the repository and is not a runtime API. Consumers should start at [docs/README.md](docs/README.md).
