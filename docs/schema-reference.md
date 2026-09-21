# Schema reference

This document describes the public contract exported from `@minmoto/payment-channels`. The TypeScript declarations remain the source of truth for exact compile-time shapes.

## `PaymentChannelSchema`

| Property             | Meaning                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                 | Stable lowercase snake-case channel ID. Built-ins use `<network>_<variant?>_<country>_<currency>`. Changing a published ID is breaking.          |
| `version`            | Positive integer revision of this schema. It is not a package version.                                                                           |
| `display`            | Human label, short label, description, icon token, and `PaymentChannelGroup`.                                                                    |
| `network`            | Stable lowercase network ID and label plus two-letter uppercase country and three-letter uppercase currency codes.                               |
| `support.automation` | `none`, `manual`, or `api`; never proof that the current application can execute a payment.                                                      |
| `fields`             | Ordered values collected from the user.                                                                                                          |
| `detailRows`         | Ordered presentation and copy rows derived from validated data.                                                                                  |
| `instructions`       | Optional payer and payee operational guidance.                                                                                                   |
| `evidence`           | Optional reconciliation or receipt fields. These are metadata definitions; the validator currently validates `fields`, not evidence submissions. |

## Enums

- `PaymentChannelGroup`: `mobile_money`, `bank`, `cash`, `card`.
- `PaymentChannelAutomation`: `none`, `manual`, `api`.
- `PaymentFieldType`: `phone`, `text`, `select`, `bank_account`, `number`.
- `ValidationRuleKind`: `pattern`, `min_length`, `max_length`, `exact_length`, `one_of`.
- `NormalizationKind`: `trim`, `digits_only`, `uppercase`, `e164_ke_phone`, `e164_mw_phone`.
- `MaskingKind`: `none`, `phone`, `last4`, `shap_id`.

Serialized enum values are public compatibility surfaces. Consumers should import enum members rather than duplicating their strings.

## Fields

Every `PaymentChannelField` has `key`, `label`, `type`, and `required`. It may also declare `placeholder`, `helpText`, `sensitive`, `options`, `validation`, `normalize`, and `mask`.

`select` fields require at least one option, and only select fields may define options. Field keys are unique within a schema. Normalization strategies run in array order before required and validation checks.

`validatePaymentChannelData` converts supplied values to strings. Missing and null values become empty strings. Required empty values produce a field issue; optional empty values are omitted. A value that fails any validation rule is omitted from `data` and produces one issue per failed rule. Unknown input keys are ignored. The result is:

```ts
interface ValidationResult {
  valid: boolean;
  data: Record<string, string>;
  issues: Array<{ field: string; message: string }>;
}
```

Use `data` only when `valid` is true; a failed result can contain other fields that happened to validate.

## Validation rules

- `pattern` uses JavaScript `RegExp` syntax and tests the normalized value.
- `min_length`, `max_length`, and `exact_length` count JavaScript string length.
- `one_of` requires exact membership in its serialized `values` array.

Rules may provide a custom `message`; otherwise the library returns a field-based default. Schema definition rejects invalid regular expressions, negative or non-integer lengths, and empty allow-lists.

## Normalization

- `trim` removes leading and trailing whitespace.
- `digits_only` removes every non-digit character.
- `uppercase` applies JavaScript string uppercasing.
- `e164_ke_phone` and `e164_mw_phone` remove non-digits and normalize local, country-code, and `00`-prefixed input to a `+` form. Validation still determines whether the resulting number is accepted by the channel.

Normalization is mechanical string processing, not recipient ownership or reachability verification.

## Masking and detail rows

`renderDetailRows(schema, data)` renders every declared detail row in order. Without a template, referenced field values are joined with spaces. Templates replace `{{fieldKey}}` placeholders. Display values apply each field's mask; copy values do not.

- `none` leaves the value unchanged.
- `last4` replaces all but the final four characters with `*`.
- `phone` preserves the first four and final three characters for longer values.
- `shap_id` masks the portion before `@` as a phone and preserves the suffix.

A row returns `key`, `label`, `value`, `copyable`, and, for copyable rows, `copyValue`. Rendering is a presentation helper and does not validate its input. Pass validated normalized data.

## Registry API

- `builtinPaymentChannels` is the authoritative ordered array of built-in schemas.
- `createPaymentChannelRegistry(schemas?)` creates a fresh `Map` seeded with built-ins by default.
- `listPaymentChannelSchemas(registry, filter?)` filters by exact `country`, `currency`, and/or `group`, preserving registry order.
- `getPaymentChannelSchema(registry, id)` returns a schema or `undefined`.
- `addPaymentChannelSchema(registry, schema)` validates and adds a schema, rejecting duplicate IDs.
- `definePaymentChannelSchema(schema)` validates a definition and returns the same typed value.

The generated [registry JSON](./generated/registry.json) is useful for inspection and non-runtime tooling. Application code should discover the installed package's runtime registry so package code and channel data cannot drift.

## Trust boundary

Schema validity means the object satisfies this portable data contract. Field validity means the supplied strings satisfy its normalization and validation rules. Neither establishes identity, ownership, authorization, provider capability, transaction execution, compliance, fees, limits, exchange rates, or settlement.
