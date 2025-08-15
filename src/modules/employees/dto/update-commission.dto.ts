import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

enum CommissionType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export class UpdateCommissionDto {
  @IsOptional()
  @IsEnum(CommissionType)
  type?: CommissionType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
