import { IsEnum, IsOptional, IsUUID, IsNumber, Min } from "class-validator";
import { CreditStatus } from "@prisma/client";
import { Type } from "class-transformer";
export class FindCreditsDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;
  @IsOptional()
  @IsEnum(CreditStatus)
  status?: CreditStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
