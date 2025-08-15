import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";
export class GrantCreditDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "O valor deve ser um número com até 2 casas decimais." },
  )
  @IsPositive({ message: "O valor do crédito deve ser um número positivo." })
  @IsNotEmpty()
  amount: number;
  @IsString()
  @IsOptional()
  notes?: string;
  @IsDateString()
  @IsOptional()
  expiresAt?: Date;
}
