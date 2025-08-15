import { SubscriptionProvider } from "@prisma/client";
export interface ValidatedReceipt {
  provider: SubscriptionProvider;
  productId: string;
  transactionId: string;
  purchaseDate: Date;
  expiresDate: Date;
  isTrialPeriod: boolean;
  cancellationDate?: Date;
  autoRenewStatus: boolean;
}
export interface IReceiptValidator {
  validate(
    provider: SubscriptionProvider,
    receiptData: string,
  ): Promise<ValidatedReceipt>;
}
export const IReceiptValidator = Symbol("IReceiptValidator");
