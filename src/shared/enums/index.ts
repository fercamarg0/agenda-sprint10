export {
  SystemRole,
  BusinessStatus,
  EntityType,
  UserBusinessStatus,
  SubscriptionProvider,
  SubscriptionStatus,
  SubscriptionEventType,
  PaymentMethod,
  CashAdvanceStatus,
  CreditStatus,
  CreditTransactionType,
  ReminderItemPriority,
  NotificationType,
} from "@prisma/client";
import {
  SystemRole,
  BusinessStatus,
  EntityType,
  UserBusinessStatus,
  SubscriptionProvider,
  SubscriptionStatus,
  SubscriptionEventType,
  PaymentMethod,
  CashAdvanceStatus,
  CreditStatus,
  ReminderItemPriority,
  NotificationType,
} from "@prisma/client";
export const SYSTEM_ROLE_MAP = {
  [SystemRole.SUPER_ADMIN]: {
    label: "Super Administrador",
    color: "#E74C3C",
    priority: 1,
  },
  [SystemRole.USER]: {
    label: "Usuário",
    color: "#3498DB",
    priority: 2,
  },
} as const;
export const BUSINESS_STATUS_MAP = {
  [BusinessStatus.ACTIVE]: {
    label: "Ativo",
    color: "#2ECC71",
    icon: "✅",
  },
  [BusinessStatus.INACTIVE]: {
    label: "Inativo",
    color: "#95A5A6",
    icon: "⏸️",
  },
  [BusinessStatus.SUSPENDED]: {
    label: "Suspenso",
    color: "#E67E22",
    icon: "⚠️",
  },
} as const;
export const ENTITY_TYPE_MAP = {
  [EntityType.PERSON]: {
    label: "Pessoa Física",
    icon: "👤",
    documentMask: "###.###.###-##",
    documentLength: 11,
  },
  [EntityType.CORPORATION]: {
    label: "Pessoa Jurídica",
    icon: "🏢",
    documentMask: "##.###.###/####-##",
    documentLength: 14,
  },
} as const;
export const USER_BUSINESS_STATUS_MAP = {
  [UserBusinessStatus.PENDING]: {
    label: "Pendente",
    color: "#F39C12",
    icon: "⏳",
    canAccess: false,
  },
  [UserBusinessStatus.ACCEPTED]: {
    label: "Aceito",
    color: "#2ECC71",
    icon: "✅",
    canAccess: true,
  },
  [UserBusinessStatus.REJECTED]: {
    label: "Recusado",
    color: "#E74C3C",
    icon: "❌",
    canAccess: false,
  },
} as const;
export const SUBSCRIPTION_STATUS_MAP = {
  [SubscriptionStatus.ACTIVE]: {
    label: "Ativa",
    color: "#2ECC71",
    icon: "✅",
    canUseFeatures: true,
  },
  [SubscriptionStatus.CANCELED]: {
    label: "Cancelada",
    color: "#E74C3C",
    icon: "❌",
    canUseFeatures: false,
  },
  [SubscriptionStatus.TRIAL]: {
    label: "Período de Teste",
    color: "#9B59B6",
    icon: "🆓",
    canUseFeatures: true,
  },
  [SubscriptionStatus.PAST_DUE]: {
    label: "Vencida",
    color: "#E67E22",
    icon: "⚠️",
    canUseFeatures: false,
  },
  [SubscriptionStatus.GRACE_PERIOD]: {
    label: "Período de Graça",
    color: "#F39C12",
    icon: "⏰",
    canUseFeatures: true,
  },
  [SubscriptionStatus.EXPIRED]: {
    label: "Expirada",
    color: "#95A5A6",
    icon: "💀",
    canUseFeatures: false,
  },
} as const;
export const PAYMENT_METHOD_MAP = {
  [PaymentMethod.CASH]: {
    label: "Dinheiro",
    icon: "💵",
    requiresProcessing: false,
    instantConfirmation: true,
  },
  [PaymentMethod.CREDIT_CARD]: {
    label: "Cartão de Crédito",
    icon: "💳",
    requiresProcessing: true,
    instantConfirmation: false,
  },
  [PaymentMethod.DEBIT_CARD]: {
    label: "Cartão de Débito",
    icon: "💳",
    requiresProcessing: true,
    instantConfirmation: true,
  },
  [PaymentMethod.PIX]: {
    label: "PIX",
    icon: "🔄",
    requiresProcessing: false,
    instantConfirmation: true,
  },
  [PaymentMethod.BANK_TRANSFER]: {
    label: "Transferência Bancária",
    icon: "🏦",
    requiresProcessing: true,
    instantConfirmation: false,
  },
  [PaymentMethod.OTHER]: {
    label: "Outros",
    icon: "💳",
    requiresProcessing: true,
    instantConfirmation: false,
  },
} as const;
export const REMINDER_PRIORITY_MAP = {
  [ReminderItemPriority.NONE]: {
    label: "Sem Prioridade",
    color: "#95A5A6",
    icon: "⚪",
    sortOrder: 4,
  },
  [ReminderItemPriority.LOW]: {
    label: "Baixa",
    color: "#3498DB",
    icon: "🔵",
    sortOrder: 3,
  },
  [ReminderItemPriority.MEDIUM]: {
    label: "Média",
    color: "#F39C12",
    icon: "🟡",
    sortOrder: 2,
  },
  [ReminderItemPriority.HIGH]: {
    label: "Alta",
    color: "#E74C3C",
    icon: "🔴",
    sortOrder: 1,
  },
} as const;
export const CREDIT_STATUS_MAP = {
  [CreditStatus.AVAILABLE]: {
    label: "Disponível",
    color: "#2ECC71",
    icon: "✅",
    canUse: true,
  },
  [CreditStatus.DEPLETED]: {
    label: "Utilizado",
    color: "#95A5A6",
    icon: "✔️",
    canUse: false,
  },
  [CreditStatus.EXPIRED]: {
    label: "Expirado",
    color: "#E67E22",
    icon: "❌",
    canUse: false,
  },
  [CreditStatus.CANCELLED]: {
    label: "Cancelado",
    color: "#E74C3C",
    icon: "🚫",
    canUse: false,
  },
} as const;
export function getEnumValues<T extends Record<string, string>>(
  enumObject: T,
): string[] {
  return Object.values(enumObject);
}
export function isValidEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string,
): value is T[keyof T] {
  return Object.values(enumObject).includes(value as T[keyof T]);
}
export function getEnumMetadata<T extends keyof typeof ENUM_MAPS>(
  enumType: T,
  value: string,
): (typeof ENUM_MAPS)[T][keyof (typeof ENUM_MAPS)[T]] | null {
  const map = ENUM_MAPS[enumType];
  return map[value as keyof typeof map] || null;
}
const ENUM_MAPS = {
  SystemRole: SYSTEM_ROLE_MAP,
  BusinessStatus: BUSINESS_STATUS_MAP,
  EntityType: ENTITY_TYPE_MAP,
  UserBusinessStatus: USER_BUSINESS_STATUS_MAP,
  SubscriptionStatus: SUBSCRIPTION_STATUS_MAP,
  PaymentMethod: PAYMENT_METHOD_MAP,
  ReminderItemPriority: REMINDER_PRIORITY_MAP,
  CreditStatus: CREDIT_STATUS_MAP,
} as const;
export function IsValidEnum<T extends Record<string, string>>(
  enumObject: T,
  options?: { message?: string },
) {
  return function (target: any, propertyKey: string) {};
}
export const ACTIVE_BUSINESS_STATUSES = [BusinessStatus.ACTIVE] as const;
export const ACTIVE_USER_BUSINESS_STATUSES = [
  UserBusinessStatus.ACCEPTED,
] as const;
export const ACTIVE_SUBSCRIPTION_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIAL,
  SubscriptionStatus.GRACE_PERIOD,
] as const;
export const INSTANT_PAYMENT_METHODS = [
  PaymentMethod.CASH,
  PaymentMethod.PIX,
  PaymentMethod.DEBIT_CARD,
] as const;
export const PRIORITY_ORDER = [
  ReminderItemPriority.HIGH,
  ReminderItemPriority.MEDIUM,
  ReminderItemPriority.LOW,
  ReminderItemPriority.NONE,
] as const;
