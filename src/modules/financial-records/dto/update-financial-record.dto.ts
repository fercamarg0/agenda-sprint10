import {
  IsString,
  IsEnum,
  IsDecimal,
  IsDateString,
  IsOptional,
  IsUUID,
  Length,
  Min,
} from "class-validator";
import { PaymentMethod } from "@prisma/client";
import { FinancialRecordType } from "./create-financial-record.dto";

export class UpdateFinancialRecordDto {
  @IsOptional()
  @IsEnum(FinancialRecordType)
  type?: FinancialRecordType;

  @IsOptional()
  @IsDecimal({ decimal_digits: "2" })
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

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
