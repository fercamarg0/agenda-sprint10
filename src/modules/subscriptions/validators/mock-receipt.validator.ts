import { Injectable } from "@nestjs/common";
import { SubscriptionProvider } from "@prisma/client";
import {
  IReceiptValidator,
  ValidatedReceipt,
} from "./validated-receipt.interface";
@Injectable()
export class MockReceiptValidator implements IReceiptValidator {
  validate(
    provider: SubscriptionProvider,
    receiptData: string,
  ): Promise<ValidatedReceipt> {
    console.log(
      `[MOCK] Validando recibo para ${provider} com dados: ${receiptData}`,
    );
    const now = new Date();
    const transactionId = `mock_trx_${Date.now()}`;
    switch (receiptData) {
      case "valid_monthly_trial":
        return Promise.resolve({
          provider,
          productId: "agenda_power_monthly_pro",
          transactionId,
          purchaseDate: now,
          expiresDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          isTrialPeriod: true,
          autoRenewStatus: true,
        });
      case "expired_monthly":
        return Promise.resolve({
          provider,
          productId: "agenda_power_monthly_pro",
          transactionId,
          purchaseDate: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000),
          expiresDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          isTrialPeriod: false,
          autoRenewStatus: false,
          cancellationDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        });
      case "valid_monthly":
      default:
        return Promise.resolve({
          provider,
          productId: "agenda_power_monthly_pro",
          transactionId,
          purchaseDate: now,
          expiresDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          isTrialPeriod: false,
          autoRenewStatus: true,
        });
    }
  }
}
