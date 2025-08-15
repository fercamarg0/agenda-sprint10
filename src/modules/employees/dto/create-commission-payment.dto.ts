import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
export class CreateCommissionPaymentDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
  @IsNotEmpty()
  @IsDateString()
  paymentDate: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
