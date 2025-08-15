import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";
export class RedeemCreditDto {
  @IsNotEmpty()
  @IsUUID()
  creditId: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
  @IsOptional()
  @IsString()
  notes?: string;
  @IsOptional()
  @IsUUID()
  appointmentId?: string;
  @IsOptional()
  @IsUUID()
  productSaleId?: string;
}
