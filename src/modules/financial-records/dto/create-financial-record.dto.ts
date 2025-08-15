import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsDecimal,
  IsDateString,
  IsOptional,
  IsUUID,
  Length,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import { PaymentMethod } from "@prisma/client";
export enum FinancialRecordType {
  INCOME = "income",
  EXPENSE = "expense",
}
export class CreateFinancialRecordDto {
  @IsEnum(FinancialRecordType)
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: "2" })
  @Min(0.01)
  amount: number;
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  @IsOptional()
  @IsDateString()
  transactionDate?: string;
  @IsOptional()
  @IsString()
  @Length(1, 100)
  category?: string;
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  observations?: string;
  @IsOptional()
  @IsUUID()
  customerId?: string;
  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}
