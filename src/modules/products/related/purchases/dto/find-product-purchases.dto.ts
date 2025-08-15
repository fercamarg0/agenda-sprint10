import { Transform } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from "class-validator";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination/pagination-query.dto";
import { PaymentMethod } from "@prisma/client";
import { IsOptionalEnumField } from "../../../../../shared/decorators/enum-validation.decorator";
export class FindProductPurchasesDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID(4, { message: "ID do fornecedor deve ser um UUID válido" })
  supplierId?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "Data deve estar no formato válido (YYYY-MM-DD)" },
  )
  startDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "Data deve estar no formato válido (YYYY-MM-DD)" },
  )
  endDate?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Valor deve ter no máximo 2 casas decimais" },
  )
  @Min(0, { message: "Valor mínimo não pode ser negativo" })
  minValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Valor deve ter no máximo 2 casas decimais" },
  )
  @Min(0, { message: "Valor máximo não pode ser negativo" })
  maxValue?: number;

  @IsOptionalEnumField(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString({ message: "A descrição deve ser uma string" })
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: "ID do produto deve ser um UUID válido" })
  productId?: string;

  @IsOptional()
  @IsBoolean({ message: "includeDeleted deve ser um boolean" })
  includeDeleted?: boolean = false;
  @IsOptional()
  @IsString({ message: "Campo de ordenação deve ser uma string" })
  sortBy?: "purchaseDate" | "value" | "createdAt" = "purchaseDate";
  @IsOptional()
  @IsString({ message: "Direção de ordenação deve ser uma string" })
  sortOrder?: "asc" | "desc" = "desc";
}
