import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
enum CommissionType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}
export class CreateCommissionDto {
  @IsNotEmpty()
  @IsEnum(CommissionType)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;
  @IsOptional()
  @IsString()
  description?: string;
}
