import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";
export class RegisterCommissionPaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
