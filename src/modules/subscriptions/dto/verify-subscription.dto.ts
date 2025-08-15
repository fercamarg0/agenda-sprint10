import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { SubscriptionProvider } from "@prisma/client";
export class VerifySubscriptionDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionProvider)
  provider: SubscriptionProvider;
  @IsNotEmpty()
  @IsString()
  providerSubscriptionId: string;
  @IsNotEmpty()
  @IsString()
  planId: string;
  @IsNotEmpty()
  @IsUUID()
  businessId: string;
}
