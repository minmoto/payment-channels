export enum PaymentChannelGroup {
  MobileMoney = "mobile_money",
  Bank = "bank",
  Cash = "cash",
  Card = "card",
}

export enum PaymentChannelAutomation {
  None = "none",
  Manual = "manual",
  Api = "api",
}

export enum PaymentFieldType {
  Phone = "phone",
  Text = "text",
  Select = "select",
  BankAccount = "bank_account",
  Number = "number",
}

export enum ValidationRuleKind {
  Pattern = "pattern",
  MinLength = "min_length",
  MaxLength = "max_length",
  ExactLength = "exact_length",
  OneOf = "one_of",
}

export enum NormalizationKind {
  Trim = "trim",
  DigitsOnly = "digits_only",
  Uppercase = "uppercase",
  E164KenyaPhone = "e164_ke_phone",
  E164MalawiPhone = "e164_mw_phone",
}

export enum MaskingKind {
  None = "none",
  Phone = "phone",
  Last4 = "last4",
  ShapId = "shap_id",
}

export type CurrencyCode = Uppercase<string>;
export type CountryCode = Uppercase<string>;
export type PaymentChannelId = Lowercase<string>;
export type MoneyNetworkId = Lowercase<string>;

export interface PaymentNetwork {
  id: MoneyNetworkId;
  label: string;
  country: CountryCode;
  currency: CurrencyCode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type ValidationRule =
  | {
      kind: ValidationRuleKind.Pattern;
      pattern: string;
      message?: string;
    }
  | {
      kind:
        | ValidationRuleKind.MinLength
        | ValidationRuleKind.MaxLength
        | ValidationRuleKind.ExactLength;
      length: number;
      message?: string;
    }
  | {
      kind: ValidationRuleKind.OneOf;
      values: readonly string[];
      message?: string;
    };

export interface PaymentChannelField {
  key: string;
  label: string;
  type: PaymentFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  sensitive?: boolean;
  options?: readonly SelectOption[];
  validation?: readonly ValidationRule[];
  normalize?: readonly NormalizationKind[];
  mask?: MaskingKind;
}

export interface DetailRow {
  key: string;
  label: string;
  fields: readonly string[];
  template?: string;
  copyable?: boolean;
  copyTemplate?: string;
}

export interface PaymentInstructions {
  payer?: readonly string[];
  payee?: readonly string[];
}

export interface EvidenceField {
  key: string;
  label: string;
  type: PaymentFieldType.Text;
  required: boolean;
  validation?: readonly ValidationRule[];
}

export interface PaymentChannelSchema {
  id: PaymentChannelId;
  version: number;
  display: {
    label: string;
    shortLabel: string;
    description: string;
    icon: string;
    group: PaymentChannelGroup;
  };
  network: PaymentNetwork;
  support: {
    automation: PaymentChannelAutomation;
  };
  fields: readonly PaymentChannelField[];
  detailRows: readonly DetailRow[];
  instructions?: PaymentInstructions;
  evidence?: readonly EvidenceField[];
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  data: Record<string, string>;
  issues: ValidationIssue[];
}

export interface RenderedDetailRow {
  key: string;
  label: string;
  value: string;
  copyable: boolean;
  copyValue?: string;
}

const REQUIRED_SCHEMA_KEYS = ["id", "version", "display", "network", "support", "fields", "detailRows"] as const;

export function definePaymentChannelSchema<T extends PaymentChannelSchema>(schema: T): T {
  assertValidSchema(schema);
  return schema;
}

export function buildPaymentChannelRegistry(
  schemas: readonly PaymentChannelSchema[],
): Map<PaymentChannelId, PaymentChannelSchema> {
  const registry = new Map<PaymentChannelId, PaymentChannelSchema>();
  for (const schema of schemas) {
    addPaymentChannelSchema(registry, schema);
  }
  return registry;
}

export function addPaymentChannelSchema(
  registry: Map<PaymentChannelId, PaymentChannelSchema>,
  schema: PaymentChannelSchema,
): void {
  assertValidSchema(schema);
  if (registry.has(schema.id)) {
    throw new Error(`Duplicate payment channel id: ${schema.id}`);
  }
  registry.set(schema.id, schema);
}

export function listPaymentChannelSchemas(
  registry: Map<PaymentChannelId, PaymentChannelSchema>,
  filter: {
    currency?: CurrencyCode;
    country?: CountryCode;
    group?: PaymentChannelGroup;
  } = {},
): PaymentChannelSchema[] {
  return [...registry.values()].filter((schema) => {
    if (filter.currency && schema.network.currency !== filter.currency) return false;
    if (filter.country && schema.network.country !== filter.country) return false;
    if (filter.group && schema.display.group !== filter.group) return false;
    return true;
  });
}

export function getPaymentChannelSchema(
  registry: Map<PaymentChannelId, PaymentChannelSchema>,
  id: PaymentChannelId,
): PaymentChannelSchema | undefined {
  return registry.get(id);
}

export function validatePaymentChannelData(
  schema: PaymentChannelSchema,
  input: Record<string, unknown>,
): ValidationResult {
  const data: Record<string, string> = {};
  const issues: ValidationIssue[] = [];

  for (const field of schema.fields) {
    const rawValue = input[field.key];
    const normalized = normalizeFieldValue(field, rawValue);
    if (field.required && normalized.length === 0) {
      issues.push({ field: field.key, message: `${field.label} is required` });
      continue;
    }
    if (normalized.length === 0) {
      continue;
    }

    const fieldIssues = validateFieldValue(field, normalized);
    if (fieldIssues.length > 0) {
      issues.push(...fieldIssues);
      continue;
    }
    data[field.key] = normalized;
  }

  return { valid: issues.length === 0, data, issues };
}

export function normalizeFieldValue(field: PaymentChannelField, value: unknown): string {
  let next = value === undefined || value === null ? "" : String(value);
  for (const strategy of field.normalize ?? []) {
    if (strategy === NormalizationKind.Trim) next = next.trim();
    if (strategy === NormalizationKind.DigitsOnly) next = next.replace(/\D/g, "");
    if (strategy === NormalizationKind.Uppercase) next = next.toUpperCase();
    if (strategy === NormalizationKind.E164KenyaPhone) next = toE164(next, "254");
    if (strategy === NormalizationKind.E164MalawiPhone) next = toE164(next, "265");
  }
  return next;
}

export function maskFieldValue(field: PaymentChannelField, value: string): string {
  if (field.mask === MaskingKind.None || !field.mask) return value;
  if (field.mask === MaskingKind.Last4) return maskLast4(value);
  if (field.mask === MaskingKind.Phone) return maskPhone(value);
  if (field.mask === MaskingKind.ShapId) return maskShapId(value);
  return value;
}

export function renderDetailRows(
  schema: PaymentChannelSchema,
  data: Record<string, string>,
): RenderedDetailRow[] {
  const fieldsByKey = new Map(schema.fields.map((field) => [field.key, field]));
  return schema.detailRows.map((row) => {
    const value = renderTemplate(row.template, row.fields, data, (fieldKey, fieldValue) => {
      const field = fieldsByKey.get(fieldKey);
      return field ? maskFieldValue(field, fieldValue) : fieldValue;
    });
    const copyValue = row.copyable
      ? renderTemplate(row.copyTemplate ?? row.template, row.fields, data)
      : undefined;
    return {
      key: row.key,
      label: row.label,
      value,
      copyable: row.copyable ?? false,
      ...(copyValue === undefined ? {} : { copyValue }),
    };
  });
}

function validateFieldValue(field: PaymentChannelField, value: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const rule of field.validation ?? []) {
    if (rule.kind === ValidationRuleKind.Pattern && !new RegExp(rule.pattern).test(value)) {
      issues.push({ field: field.key, message: rule.message ?? `${field.label} has an invalid format` });
    }
    if (rule.kind === ValidationRuleKind.MinLength && value.length < rule.length) {
      issues.push({ field: field.key, message: rule.message ?? `${field.label} is too short` });
    }
    if (rule.kind === ValidationRuleKind.MaxLength && value.length > rule.length) {
      issues.push({ field: field.key, message: rule.message ?? `${field.label} is too long` });
    }
    if (rule.kind === ValidationRuleKind.ExactLength && value.length !== rule.length) {
      issues.push({ field: field.key, message: rule.message ?? `${field.label} must be ${rule.length} characters` });
    }
    if (rule.kind === ValidationRuleKind.OneOf && !rule.values.includes(value)) {
      issues.push({ field: field.key, message: rule.message ?? `${field.label} is not supported` });
    }
  }
  return issues;
}

function assertValidSchema(schema: PaymentChannelSchema): void {
  for (const key of REQUIRED_SCHEMA_KEYS) {
    if (!(key in schema)) throw new Error(`Payment channel schema missing ${key}`);
  }

  if (!/^[a-z0-9_]+$/.test(schema.id)) {
    throw new Error(`Payment channel schema id must be lowercase snake case in ${schema.id}`);
  }
  if (!Number.isInteger(schema.version) || schema.version < 1) {
    throw new Error(`Payment channel schema version must be a positive integer in ${schema.id}`);
  }
  if (!/^[a-z0-9_]+$/.test(schema.network.id)) {
    throw new Error(`Payment network id must be lowercase snake case in ${schema.id}`);
  }
  if (!/^[A-Z]{2}$/.test(schema.network.country)) {
    throw new Error(`Payment channel country must be a 2-letter uppercase code in ${schema.id}`);
  }
  if (!/^[A-Z]{3}$/.test(schema.network.currency)) {
    throw new Error(`Payment channel currency must be a 3-letter uppercase code in ${schema.id}`);
  }
  if (!Object.values(PaymentChannelGroup).includes(schema.display.group)) {
    throw new Error(`Payment channel group is invalid in ${schema.id}`);
  }
  if (!Object.values(PaymentChannelAutomation).includes(schema.support.automation)) {
    throw new Error(`Payment channel automation is invalid in ${schema.id}`);
  }

  const keys = new Set<string>();
  for (const field of schema.fields) {
    if (!field.key || !field.label) throw new Error(`Payment channel field must have a key and label in ${schema.id}`);
    if (!/^[a-zA-Z0-9_]+$/.test(field.key)) {
      throw new Error(`Payment channel field key must be alphanumeric or underscore in ${schema.id}.${field.key}`);
    }
    if (keys.has(field.key)) throw new Error(`Duplicate field key ${field.key} in ${schema.id}`);
    keys.add(field.key);
    if (!Object.values(PaymentFieldType).includes(field.type)) {
      throw new Error(`Payment channel field type is invalid in ${schema.id}.${field.key}`);
    }
    if (field.mask && !Object.values(MaskingKind).includes(field.mask)) {
      throw new Error(`Payment channel field mask is invalid in ${schema.id}.${field.key}`);
    }
    for (const strategy of field.normalize ?? []) {
      if (!Object.values(NormalizationKind).includes(strategy)) {
        throw new Error(`Payment channel normalization is invalid in ${schema.id}.${field.key}`);
      }
    }
    if (field.type === PaymentFieldType.Select && (!field.options || field.options.length === 0)) {
      throw new Error(`Select field requires options in ${schema.id}.${field.key}`);
    }
    if (field.type !== PaymentFieldType.Select && field.options && field.options.length > 0) {
      throw new Error(`Only select fields can define options in ${schema.id}.${field.key}`);
    }
    if (field.options) {
      const optionValues = new Set<string>();
      for (const option of field.options) {
        if (!option.value || !option.label) {
          throw new Error(`Select options must have value and label in ${schema.id}.${field.key}`);
        }
        if (optionValues.has(option.value)) {
          throw new Error(`Duplicate select option value ${option.value} in ${schema.id}.${field.key}`);
        }
        optionValues.add(option.value);
      }
    }

    for (const rule of field.validation ?? []) {
      if (!Object.values(ValidationRuleKind).includes(rule.kind)) {
        throw new Error(`Payment channel validation rule is invalid in ${schema.id}.${field.key}`);
      }
      if (rule.kind === ValidationRuleKind.Pattern) {
        try {
          new RegExp(rule.pattern);
        } catch {
          throw new Error(`Invalid validation pattern for ${schema.id}.${field.key}`);
        }
      }
      if (
        (rule.kind === ValidationRuleKind.MinLength ||
          rule.kind === ValidationRuleKind.MaxLength ||
          rule.kind === ValidationRuleKind.ExactLength) &&
        (!Number.isInteger(rule.length) || rule.length < 0)
      ) {
        throw new Error(`Invalid validation length for ${schema.id}.${field.key}`);
      }
      if (rule.kind === ValidationRuleKind.OneOf && rule.values.length === 0) {
        throw new Error(`One-of validation requires values for ${schema.id}.${field.key}`);
      }
    }
  }

  const detailRowKeys = new Set<string>();
  for (const row of schema.detailRows) {
    if (!row.key || !row.label) throw new Error(`Detail row must have a key and label in ${schema.id}`);
    if (detailRowKeys.has(row.key)) throw new Error(`Duplicate detail row key ${row.key} in ${schema.id}`);
    detailRowKeys.add(row.key);
    if (row.fields.length === 0) throw new Error(`Detail row ${row.key} must reference at least one field in ${schema.id}`);
    for (const field of row.fields) {
      if (!keys.has(field)) throw new Error(`Detail row ${row.key} references unknown field ${field}`);
    }
  }

  for (const field of schema.evidence ?? []) {
    if (!field.key || !field.label) throw new Error(`Evidence field must have a key and label in ${schema.id}`);
    if (!/^[a-zA-Z0-9_]+$/.test(field.key)) {
      throw new Error(`Evidence field key must be alphanumeric or underscore in ${schema.id}.${field.key}`);
    }
    if (field.type !== PaymentFieldType.Text) {
      throw new Error(`Evidence field type must be text in ${schema.id}.${field.key}`);
    }
    for (const rule of field.validation ?? []) {
      if (!Object.values(ValidationRuleKind).includes(rule.kind)) {
        throw new Error(`Evidence validation rule is invalid in ${schema.id}.${field.key}`);
      }
      if (rule.kind === ValidationRuleKind.Pattern) {
        try {
          new RegExp(rule.pattern);
        } catch {
          throw new Error(`Invalid evidence validation pattern for ${schema.id}.${field.key}`);
        }
      }
      if (
        (rule.kind === ValidationRuleKind.MinLength ||
          rule.kind === ValidationRuleKind.MaxLength ||
          rule.kind === ValidationRuleKind.ExactLength) &&
        (!Number.isInteger(rule.length) || rule.length < 0)
      ) {
        throw new Error(`Invalid evidence validation length for ${schema.id}.${field.key}`);
      }
      if (rule.kind === ValidationRuleKind.OneOf && rule.values.length === 0) {
        throw new Error(`One-of evidence validation requires values for ${schema.id}.${field.key}`);
      }
    }
  }
}

function renderTemplate(
  template: string | undefined,
  fields: readonly string[],
  data: Record<string, string>,
  formatValue: (field: string, value: string) => string = (_field, value) => value,
): string {
  if (!template) {
    return fields.map((field) => formatValue(field, data[field] ?? "")).filter(Boolean).join(" ");
  }
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) =>
    formatValue(key, data[key] ?? ""),
  );
}

function toE164(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.length > 2 ? `+${digits.slice(2)}` : "";
  if (digits.startsWith(countryCode)) return `+${digits}`;
  if (digits.startsWith("0")) return `+${countryCode}${digits.slice(1)}`;
  return digits ? `+${countryCode}${digits}` : "";
}

function maskLast4(value: string): string {
  if (value.length <= 4) return value;
  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

function maskPhone(value: string): string {
  if (value.length <= 7) return maskLast4(value);
  return `${value.slice(0, 4)}***${value.slice(-3)}`;
}

function maskShapId(value: string): string {
  const separatorIndex = value.indexOf("@");
  if (separatorIndex === -1) return maskPhone(value);
  return `${maskPhone(value.slice(0, separatorIndex))}${value.slice(separatorIndex)}`;
}
