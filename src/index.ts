export enum PaymentChannelGroup {
  MobileMoney = "mobile_money",
  Bank = "bank",
  Cash = "cash",
  Card = "card",
}

export enum PaymentFlow {
  Onramp = "onramp",
  Offramp = "offramp",
}

export enum PaymentActor {
  Agent = "agent",
  Customer = "customer",
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
    flows: readonly PaymentFlow[];
    actors: readonly PaymentActor[];
    automatedPayout: boolean;
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

const REQUIRED_SCHEMA_KEYS = ["id", "version", "display", "network", "support", "fields"] as const;

export function definePaymentChannelSchema<T extends PaymentChannelSchema>(schema: T): T {
  assertValidSchema(schema);
  return schema;
}

export function createPaymentChannelRegistry(
  schemas: readonly PaymentChannelSchema[] = builtinPaymentChannels,
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
    flow?: PaymentFlow;
    actor?: PaymentActor;
  } = {},
): PaymentChannelSchema[] {
  return [...registry.values()].filter((schema) => {
    if (filter.currency && schema.network.currency !== filter.currency) return false;
    if (filter.country && schema.network.country !== filter.country) return false;
    if (filter.group && schema.display.group !== filter.group) return false;
    if (filter.flow && !schema.support.flows.includes(filter.flow)) return false;
    if (filter.actor && !schema.support.actors.includes(filter.actor)) return false;
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
  return value;
}

export function renderDetailRows(
  schema: PaymentChannelSchema,
  data: Record<string, string>,
): RenderedDetailRow[] {
  return schema.detailRows.map((row) => {
    const value = renderTemplate(row.template, row.fields, data);
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

  const keys = new Set<string>();
  for (const field of schema.fields) {
    if (!field.key || !field.label) throw new Error(`Payment channel field must have a key and label in ${schema.id}`);
    if (keys.has(field.key)) throw new Error(`Duplicate field key ${field.key} in ${schema.id}`);
    keys.add(field.key);

    for (const rule of field.validation ?? []) {
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

  for (const row of schema.detailRows) {
    for (const field of row.fields) {
      if (!keys.has(field)) throw new Error(`Detail row ${row.key} references unknown field ${field}`);
    }
  }
}

function renderTemplate(
  template: string | undefined,
  fields: readonly string[],
  data: Record<string, string>,
): string {
  if (!template) {
    return fields.map((field) => data[field] ?? "").filter(Boolean).join(" ");
  }
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => data[key] ?? "");
}

function toE164(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, "");
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

const phoneNumberField: PaymentChannelField = {
  key: "phoneNumber",
  label: "Phone number",
  type: PaymentFieldType.Phone,
  required: true,
  sensitive: true,
  mask: MaskingKind.Phone,
  normalize: [NormalizationKind.Trim],
};

const descriptionField: PaymentChannelField = {
  key: "description",
  label: "Description",
  type: PaymentFieldType.Text,
  required: false,
  normalize: [NormalizationKind.Trim],
  validation: [{ kind: ValidationRuleKind.MaxLength, length: 100 }],
};

const mobileReferenceEvidence: readonly EvidenceField[] = [
  {
    key: "transactionReference",
    label: "Transaction reference",
    type: PaymentFieldType.Text,
    required: true,
    validation: [{ kind: ValidationRuleKind.MinLength, length: 3 }],
  },
];

export const builtinPaymentChannels: readonly PaymentChannelSchema[] = [
  definePaymentChannelSchema({
    id: "mpesa_phone",
    version: 1,
    display: {
      label: "M-Pesa phone",
      shortLabel: "M-Pesa",
      description: "Safaricom M-Pesa wallet transfer to a Kenyan phone number.",
      icon: "mpesa",
      group: PaymentChannelGroup.MobileMoney,
    },
    network: { id: "mpesa", label: "M-Pesa", country: "KE", currency: "KES" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: true,
    },
    fields: [
      {
        ...phoneNumberField,
        placeholder: "+254712345678",
        normalize: [NormalizationKind.Trim, NormalizationKind.E164KenyaPhone],
        validation: [
          {
            kind: ValidationRuleKind.Pattern,
            pattern: "^\\+254[0-9]{9}$",
            message: "Use a Kenyan phone number in international format, e.g. +254712345678",
          },
        ],
      },
      descriptionField,
    ],
    detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
    instructions: {
      payer: ["Send the exact amount to the displayed M-Pesa phone number."],
      payee: ["Confirm the M-Pesa reference is available if the payment is disputed."],
    },
    evidence: mobileReferenceEvidence,
  }),
  definePaymentChannelSchema({
    id: "mpesa_till",
    version: 1,
    display: {
      label: "M-Pesa till",
      shortLabel: "Till",
      description: "Safaricom M-Pesa Buy Goods till payment.",
      icon: "mpesa",
      group: PaymentChannelGroup.MobileMoney,
    },
    network: { id: "mpesa", label: "M-Pesa", country: "KE", currency: "KES" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: true,
    },
    fields: [
      {
        key: "tillNumber",
        label: "Till number",
        type: PaymentFieldType.Text,
        required: true,
        placeholder: "123456",
        normalize: [NormalizationKind.Trim, NormalizationKind.DigitsOnly],
        validation: [
          { kind: ValidationRuleKind.Pattern, pattern: "^\\d{5,7}$", message: "Use a 5-7 digit till number" },
        ],
      },
      descriptionField,
    ],
    detailRows: [{ key: "tillNumber", label: "Till number", fields: ["tillNumber"], copyable: true }],
    evidence: mobileReferenceEvidence,
  }),
  definePaymentChannelSchema({
    id: "mpesa_paybill",
    version: 1,
    display: {
      label: "M-Pesa paybill",
      shortLabel: "Paybill",
      description: "Safaricom M-Pesa Pay Bill payment with an account reference.",
      icon: "mpesa",
      group: PaymentChannelGroup.MobileMoney,
    },
    network: { id: "mpesa", label: "M-Pesa", country: "KE", currency: "KES" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: true,
    },
    fields: [
      {
        key: "paybillNumber",
        label: "Paybill number",
        type: PaymentFieldType.Text,
        required: true,
        placeholder: "123456",
        normalize: [NormalizationKind.Trim, NormalizationKind.DigitsOnly],
        validation: [
          { kind: ValidationRuleKind.Pattern, pattern: "^\\d{5,7}$", message: "Use a 5-7 digit paybill number" },
        ],
      },
      {
        key: "accountNumber",
        label: "Account number",
        type: PaymentFieldType.Text,
        required: true,
        placeholder: "Account reference",
        normalize: [NormalizationKind.Trim],
        validation: [
          { kind: ValidationRuleKind.MinLength, length: 1 },
          { kind: ValidationRuleKind.MaxLength, length: 20 },
        ],
      },
      descriptionField,
    ],
    detailRows: [
      { key: "paybillNumber", label: "Paybill number", fields: ["paybillNumber"], copyable: true },
      { key: "accountNumber", label: "Account number", fields: ["accountNumber"], copyable: true },
    ],
    evidence: mobileReferenceEvidence,
  }),
  definePaymentChannelSchema({
    id: "airtel_money",
    version: 1,
    display: {
      label: "Airtel Money",
      shortLabel: "Airtel",
      description: "Airtel Money wallet transfer to a phone number.",
      icon: "airtel-money",
      group: PaymentChannelGroup.MobileMoney,
    },
    network: { id: "airtel_money", label: "Airtel Money", country: "KE", currency: "KES" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: true,
    },
    fields: [
      {
        ...phoneNumberField,
        placeholder: "+254712345678",
        normalize: [NormalizationKind.Trim, NormalizationKind.E164KenyaPhone],
        validation: [
          {
            kind: ValidationRuleKind.Pattern,
            pattern: "^\\+254[0-9]{9}$",
            message: "Use a Kenyan phone number in international format, e.g. +254712345678",
          },
        ],
      },
      descriptionField,
    ],
    detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
    evidence: mobileReferenceEvidence,
  }),
  definePaymentChannelSchema({
    id: "airtel_money_mw",
    version: 1,
    display: {
      label: "Airtel Money Malawi",
      shortLabel: "Airtel MW",
      description: "Airtel Money Malawi wallet transfer to an Airtel phone number.",
      icon: "airtel-money",
      group: PaymentChannelGroup.MobileMoney,
    },
    network: { id: "airtel_money", label: "Airtel Money", country: "MW", currency: "MWK" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: true,
    },
    fields: [
      {
        ...phoneNumberField,
        placeholder: "+265991234567",
        normalize: [NormalizationKind.Trim, NormalizationKind.E164MalawiPhone],
        validation: [
          {
            kind: ValidationRuleKind.Pattern,
            pattern: "^\\+2659[89][0-9]{7}$",
            message: "Use an Airtel Malawi number, e.g. +265991234567",
          },
        ],
      },
      descriptionField,
    ],
    detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
    evidence: mobileReferenceEvidence,
  }),
  definePaymentChannelSchema({
    id: "tnm_mpamba",
    version: 1,
    display: {
      label: "TNM Mpamba",
      shortLabel: "Mpamba",
      description: "TNM Mpamba wallet transfer to a TNM phone number.",
      icon: "tnm-mpamba",
      group: PaymentChannelGroup.MobileMoney,
    },
    network: { id: "tnm_mpamba", label: "TNM Mpamba", country: "MW", currency: "MWK" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: true,
    },
    fields: [
      {
        ...phoneNumberField,
        placeholder: "+265881234567",
        normalize: [NormalizationKind.Trim, NormalizationKind.E164MalawiPhone],
        validation: [
          {
            kind: ValidationRuleKind.Pattern,
            pattern: "^\\+2658[48][0-9]{7}$",
            message: "Use a TNM Malawi number, e.g. +265881234567",
          },
        ],
      },
      descriptionField,
    ],
    detailRows: [{ key: "phoneNumber", label: "Phone number", fields: ["phoneNumber"], copyable: true }],
    evidence: mobileReferenceEvidence,
  }),
  definePaymentChannelSchema({
    id: "cash",
    version: 1,
    display: {
      label: "Cash",
      shortLabel: "Cash",
      description: "In-person cash settlement. Cash has no structured payment fields and is not automatable.",
      icon: "cash",
      group: PaymentChannelGroup.Cash,
    },
    network: { id: "cash", label: "Cash", country: "KE", currency: "KES" },
    support: {
      flows: [PaymentFlow.Onramp, PaymentFlow.Offramp],
      actors: [PaymentActor.Agent, PaymentActor.Customer],
      automatedPayout: false,
    },
    fields: [],
    detailRows: [],
    instructions: {
      payer: ["Exchange cash in person and keep local receipt evidence when required."],
    },
    evidence: [
      {
        key: "receiptNote",
        label: "Receipt note",
        type: PaymentFieldType.Text,
        required: false,
      },
    ],
  }),
];
