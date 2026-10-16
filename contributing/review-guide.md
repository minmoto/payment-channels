# Reviewing channel contributions

Keep three questions separate: does the code satisfy the package contract, do the documents support the claims, and does the channel reflect local payment practice? A merged PR or passing CI answers only the first question unless a review explicitly records more.

## Technical review

Check stable IDs, country/currency/network relationships, portable fields and validation, sensitive-value handling, exports, source layout, registry discovery, and rendering. Preserve existing behavior unless a breaking change is explicitly intended. Run the checks in [CONTRIBUTING.md](../CONTRIBUTING.md). A schema does not establish recipient ownership or provider payout capability.

## Documentary review

For each claimed field format, normalization, currency, and instruction, link the relevant central-bank, government, network, or provider documentation. Identify which claim the source supports and its verification date. Link a specific page or document rather than a homepage when possible. Note conflicting or outdated documentation and distinguish provider-specific requirements from network-wide requirements.

Cash research must establish ordinary physical circulation, not just a currency code, peg, or convertibility. Record proposed inclusions, exclusions, and unresolved cases. Use UN M49 to distinguish the scopes of #21 and #29; do not infer a region from the currency or silently omit a territory.

## Local market review

A reviewer should state their relevant experience, the country/network and exact claims they checked, the date, supporting sources, and limitations. Practical experience can come from operating merchant payments, supporting users, integrating a network, or researching local payment systems. Formal credentials are not required. Mention provider affiliations or other interests relevant to the review.

Do not use a blanket “expert verified” badge. Record a review like this in the issue or PR:

```text
Scope: channel ID and fields/currency pairs checked
Experience: relevant role and market experience; affiliation if relevant
Findings: confirmed claims, corrections, and uncertainty
Sources: direct links and date checked
Limitations: variants, regions, or provider behavior not covered
Reviewed on: YYYY-MM-DD
Preferred credit: public handle, name, or no additional credit
```

Maintainers may request another local reviewer when ordinary usage, field semantics, or conflicting sources remain uncertain. Honor any explicit specialist-review requirement on the linked issue. Technical approval must not silently satisfy it.

## Evidence records and decisions

[evidence.json](evidence.json) records contributor evidence separately from runtime schemas. Each record identifies one proposed or implemented channel ID, its country/currency/network, source claims, source-check date, tracking issue, decision, and optional local review. The generated [coverage view](coverage.md) joins these records with the runtime inventory.

- `pending`: research or a maintainer decision is outstanding. Existing implementation does not change this status automatically.
- `accepted`: a maintainer has accepted the scoped source-backed definition. Supply sources, a source-check date, and a linked decision. This does not imply local review.
- `excluded`: a maintainer has documented why a candidate is out of scope. Supply the same evidence and decision information. An excluded record for an existing built-in is flagged for follow-up rather than removing it automatically.

Set `marketReview` only from a linked, explicit review with `reviewer`, `experience`, `scope`, `reviewedOn`, and `reference`. Leave it `null` when no such review is recorded. Do not infer expertise from a GitHub approval, employer, geography, or implementation authorship. `sourceCheckedOn` is the date somebody actually checked the linked sources, not the generator's execution date. Null dates and absent records are displayed as missing evidence, not as approval.

Evidence-only changes can be submitted without writing TypeScript. Maintainers regenerate the view after accepting them. Contributor records are not consumer routing policy or a guarantee of local acceptance.

## Triage and completion

Use `research`, `market-review`, and `implementation` to describe the work. Use `needs-evidence` for unsupported or unresolved claims and `help wanted` for tasks open to contributors. Reserve `good first issue` for bounded tasks with enough guidance for a newcomer; uncertain regulatory or market research is not automatically beginner work.

For a child task, record the exact questions, deliverable, exclusions, and completion criteria. Link it from its umbrella issue. An umbrella coverage issue closes only after the agreed source-backed matrix accounts for the full scope, all accepted rows are implemented, exclusions and ambiguity are resolved, and tests check the accepted matrix. The generated implemented inventory alone cannot prove completeness.

Explain the next step when acknowledging a contribution. Do not promise a response-time SLA without maintainer capacity. Credit research, local review, translation, and code in PR descriptions and [CONTRIBUTORS.md](../CONTRIBUTORS.md); include recognition when reviewing the generated release PR rather than editing released changelogs. Invite repeat contributors to review a bounded market or network with their agreement; no contributor is assigned ongoing responsibility by being named here.
