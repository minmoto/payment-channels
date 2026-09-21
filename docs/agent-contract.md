# Agent consumer contract

Use this procedure when an agent integrates `@minmoto/payment-channels`. The package describes portable payment-detail schemas; it does not execute or verify payments.

## Required procedure

1. Create a fresh registry with `createPaymentChannelRegistry()`.
2. Discover candidates with `listPaymentChannelSchemas(registry, { country, currency, group? })`. Treat ISO-style country and currency codes as application configuration, not values to guess from a user name or locale.
3. Intersect candidates with an application-owned allow-list of channel IDs. Product workflows, roles, provider contracts, risk rules, limits, and commercial availability belong in application or integration policy.
4. Select one stable channel ID. Do not select by label, array position, icon, or network name.
5. Build the collection UI from `schema.fields`. Preserve field order. Use `type`, `required`, `placeholder`, `helpText`, and `options`; treat `sensitive` as a minimum handling warning.
6. Submit raw field values to `validatePaymentChannelData(schema, input)`. Show every returned issue beside its `field`.
7. Continue only when `result.valid` is `true`. Use `result.data`, not the raw input, at the integration boundary because it contains the normalized values accepted by the schema.
8. Use `renderDetailRows(schema, result.data)` for display and copy actions. Display `value`; expose `copyValue` only for an intentional copy action. Do not log either value.
9. Apply provider authorization, ownership checks, limits, fees, compliance, fraud controls, transaction execution, reconciliation, and settlement verification outside this package.

## Discovery and allow-listing

```ts
import { createPaymentChannelRegistry, listPaymentChannelSchemas } from "@minmoto/payment-channels";

const registry = createPaymentChannelRegistry();
const approvedIds = new Set(applicationConfig.approvedPaymentChannelIds);

const available = listPaymentChannelSchemas(registry, {
  country: applicationConfig.country,
  currency: applicationConfig.currency,
  group: applicationConfig.optionalGroup,
}).filter(({ id }) => approvedIds.has(id));
```

The application allow-list is mandatory whenever a channel can reach a transaction workflow. Presence in the open registry is not approval.

## Dynamic collection and validation

For each field, choose an input control from `field.type`. For `select`, use only `field.options`. Do not translate a schema's serialized option `value`; labels may be translated by the application while submitted values remain stable.

```ts
const controls = schema.fields.map((field) => ({
  name: field.key,
  label: field.label,
  inputType: field.type,
  required: field.required,
  options: field.options ?? [],
}));

const result = validatePaymentChannelData(schema, submittedValues);
if (!result.valid) {
  return { controls, errors: result.issues };
}

const normalizedPaymentDetails = result.data;
const displayRows = renderDetailRows(schema, normalizedPaymentDetails);
```

Validation reports known schema failures; it does not prove that a destination exists or belongs to its claimed owner. Unknown input keys are not returned in `result.data`. Optional blank fields are omitted.

## Custom schemas

Create application-local schemas with `definePaymentChannelSchema`, then add them to a fresh registry with `addPaymentChannelSchema`. Use a stable lowercase market-qualified ID and serializable rules. Never embed callbacks, secrets, environment URLs, or provider clients.

Custom schemas are governed by the same allow-list and trust boundary as built-ins. Their presence does not make them eligible for automation.

## Prohibitions

An agent must not infer any of the following from a valid schema or successful validation:

- recipient identity, account ownership, or authority to use an account;
- application or provider authorization;
- provider API availability or support for a transaction direction;
- fees, limits, exchange rates, compliance, fraud status, or geographic availability;
- payment initiation, transaction status, reconciliation, or settlement;
- eligibility for a product workflow or role.

`support.automation` describes the package author's declared integration posture. `api` still requires a separately configured and authorized integration. `manual` means operational handling remains outside the schema. `none` means the channel is not automatable.

A payment network or destination type can justify a distinct channel because it changes identity, fields, validation, or routing. API, STK Push, USSD, webhook, QR, and similar mechanisms are transports or interaction methods; do not treat them as channel IDs unless they define a genuinely distinct stable payment route.

## Sensitive-data rules

- Keep raw and normalized payment details out of logs, analytics, URLs, traces, crash reports, and model prompts.
- Respect `sensitive` and `mask`, but do not assume unmarked fields are safe to disclose.
- Use rendered masked values for display. Reveal or copy raw values only through an explicit user action.
- Validate again at the trusted server or provider boundary.
- Do not retain values longer than the product and regulatory purpose requires.

## Completion checklist

- Runtime discovery and an application allow-list determine the selectable IDs.
- UI controls are derived from `fields`; required and select semantics are preserved.
- Only valid, normalized `result.data` crosses the integration boundary.
- `renderDetailRows` supplies display and copy values.
- Provider and settlement checks remain outside the schema library.
- Sensitive values are excluded from logs and analytics.
