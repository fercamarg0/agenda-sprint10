import {
  SystemRole,
  BusinessStatus,
  EntityType,
  UserBusinessStatus,
  SubscriptionStatus,
  PaymentMethod,
  ReminderItemPriority,
  CreditStatus,
  NotificationType,
} from "@prisma/client";
import {
  BUSINESS_STATUS_MAP,
  USER_BUSINESS_STATUS_MAP,
  SUBSCRIPTION_STATUS_MAP,
  PAYMENT_METHOD_MAP,
  REMINDER_PRIORITY_MAP,
  CREDIT_STATUS_MAP,
  ENTITY_TYPE_MAP,
  ACTIVE_BUSINESS_STATUSES,
  ACTIVE_USER_BUSINESS_STATUSES,
  ACTIVE_SUBSCRIPTION_STATUSES,
  INSTANT_PAYMENT_METHODS,
} from "../enums";
export class EnumValidator {
  static canAccessBusiness(businessStatus: BusinessStatus): boolean {
    return ACTIVE_BUSINESS_STATUSES.includes(businessStatus as any);
  }
  static canUserAccessBusiness(
    userBusinessStatus: UserBusinessStatus,
  ): boolean {
    return ACTIVE_USER_BUSINESS_STATUSES.includes(userBusinessStatus as any);
  }
  static canUseSubscriptionFeatures(
    subscriptionStatus: SubscriptionStatus,
  ): boolean {
    return ACTIVE_SUBSCRIPTION_STATUSES.includes(subscriptionStatus as any);
  }
  static isInstantPaymentMethod(paymentMethod: PaymentMethod): boolean {
    return INSTANT_PAYMENT_METHODS.includes(paymentMethod as any);
  }
  static canUseCredit(creditStatus: CreditStatus): boolean {
    return creditStatus === CreditStatus.AVAILABLE;
  }
  static getDocumentMask(entityType: EntityType): string {
    return ENTITY_TYPE_MAP[entityType].documentMask;
  }
  static getDocumentLength(entityType: EntityType): number {
    return ENTITY_TYPE_MAP[entityType].documentLength;
  }
}
export class EnumFormatter {
  static getBusinessStatusLabel(status: BusinessStatus): string {
    return BUSINESS_STATUS_MAP[status]?.label || status;
  }
  static getBusinessStatusIcon(status: BusinessStatus): string {
    return BUSINESS_STATUS_MAP[status]?.icon || "❓";
  }
  static getBusinessStatusColor(status: BusinessStatus): string {
    return BUSINESS_STATUS_MAP[status]?.color || "#95A5A6";
  }
  static getUserBusinessStatusLabel(status: UserBusinessStatus): string {
    return USER_BUSINESS_STATUS_MAP[status]?.label || status;
  }
  static getSubscriptionStatusLabel(status: SubscriptionStatus): string {
    return SUBSCRIPTION_STATUS_MAP[status]?.label || status;
  }
  static getPaymentMethodLabel(method: PaymentMethod): string {
    return PAYMENT_METHOD_MAP[method]?.label || method;
  }
  static getPaymentMethodIcon(method: PaymentMethod): string {
    return PAYMENT_METHOD_MAP[method]?.icon || "💳";
  }
  static getReminderPriorityLabel(priority: ReminderItemPriority): string {
    return REMINDER_PRIORITY_MAP[priority]?.label || priority;
  }
  static getReminderPriorityColor(priority: ReminderItemPriority): string {
    return REMINDER_PRIORITY_MAP[priority]?.color || "#95A5A6";
  }
  static getReminderPriorityIcon(priority: ReminderItemPriority): string {
    return REMINDER_PRIORITY_MAP[priority]?.icon || "⚪";
  }
  static getCreditStatusLabel(status: CreditStatus): string {
    return CREDIT_STATUS_MAP[status]?.label || status;
  }
  static getEntityTypeLabel(entityType: EntityType): string {
    return ENTITY_TYPE_MAP[entityType]?.label || entityType;
  }
  static getEntityTypeIcon(entityType: EntityType): string {
    return ENTITY_TYPE_MAP[entityType]?.icon || "👤";
  }
}
export class EnumTransformer {
  static toBusinessStatus(value: string): BusinessStatus | null {
    const normalized = value?.toUpperCase();
    return Object.values(BusinessStatus).includes(normalized as BusinessStatus)
      ? (normalized as BusinessStatus)
      : null;
  }
  static toUserBusinessStatus(value: string): UserBusinessStatus | null {
    const normalized = value?.toUpperCase();
    return Object.values(UserBusinessStatus).includes(
      normalized as UserBusinessStatus,
    )
      ? (normalized as UserBusinessStatus)
      : null;
  }
  static toPaymentMethod(value: string): PaymentMethod | null {
    const normalized = value?.toUpperCase().replace(/\s+/g, "_");
    return Object.values(PaymentMethod).includes(normalized as PaymentMethod)
      ? (normalized as PaymentMethod)
      : null;
  }
  static toReminderItemPriority(value: string): ReminderItemPriority | null {
    const normalized = value?.toUpperCase();
    return Object.values(ReminderItemPriority).includes(
      normalized as ReminderItemPriority,
    )
      ? (normalized as ReminderItemPriority)
      : null;
  }
  static toEntityType(value: string): EntityType | null {
    const normalized = value?.toUpperCase();
    return Object.values(EntityType).includes(normalized as EntityType)
      ? (normalized as EntityType)
      : null;
  }
}
export class EnumComparator {
  static compareReminderPriorities(
    a: ReminderItemPriority,
    b: ReminderItemPriority,
  ): number {
    const orderA = REMINDER_PRIORITY_MAP[a]?.sortOrder || 999;
    const orderB = REMINDER_PRIORITY_MAP[b]?.sortOrder || 999;
    return orderA - orderB;
  }
  static isStatusBetter(
    currentStatus: BusinessStatus,
    newStatus: BusinessStatus,
  ): boolean {
    const statusPriority = {
      [BusinessStatus.ACTIVE]: 3,
      [BusinessStatus.INACTIVE]: 2,
      [BusinessStatus.SUSPENDED]: 1,
    };
    return statusPriority[newStatus] > statusPriority[currentStatus];
  }
  static isSubscriptionBetter(
    current: SubscriptionStatus,
    newStatus: SubscriptionStatus,
  ): boolean {
    const statusPriority = {
      [SubscriptionStatus.ACTIVE]: 6,
      [SubscriptionStatus.TRIAL]: 5,
      [SubscriptionStatus.GRACE_PERIOD]: 4,
      [SubscriptionStatus.PAST_DUE]: 3,
      [SubscriptionStatus.CANCELED]: 2,
      [SubscriptionStatus.EXPIRED]: 1,
    };
    return statusPriority[newStatus] > statusPriority[current];
  }
}
export class EnumFilter {
  static getActiveBusinessStatuses(): BusinessStatus[] {
    return [...ACTIVE_BUSINESS_STATUSES];
  }
  static getActiveUserBusinessStatuses(): UserBusinessStatus[] {
    return [...ACTIVE_USER_BUSINESS_STATUSES];
  }
  static getActiveSubscriptionStatuses(): SubscriptionStatus[] {
    return [...ACTIVE_SUBSCRIPTION_STATUSES];
  }
  static getInstantPaymentMethods(): PaymentMethod[] {
    return [...INSTANT_PAYMENT_METHODS];
  }
  static getPrioritiesAbove(
    minPriority: ReminderItemPriority,
  ): ReminderItemPriority[] {
    const minOrder = REMINDER_PRIORITY_MAP[minPriority]?.sortOrder || 999;
    return Object.values(ReminderItemPriority).filter(
      (priority) =>
        (REMINDER_PRIORITY_MAP[priority]?.sortOrder || 999) <= minOrder,
    );
  }
}
