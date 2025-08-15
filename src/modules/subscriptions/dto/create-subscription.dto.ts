import { IsEnum, IsString, IsNotEmpty } from "class-validator";
import { SubscriptionProvider } from "@prisma/client";
export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  receiptData: string;
  @IsNotEmpty()
  @IsEnum(SubscriptionProvider)
  provider: SubscriptionProvider;
}
