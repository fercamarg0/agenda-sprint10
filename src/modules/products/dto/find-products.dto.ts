import { Transform } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
} from "class-validator";
import { PaginationQueryDto } from "../../../shared/dto/pagination/pagination-query.dto";
export class FindProductsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: "O nome deve ser uma string" })
  name?: string;
  @IsOptional()
  @IsUUID(4, { message: "ID da categoria deve ser um UUID válido" })
  categoryId?: string;
  @IsOptional()
  @IsBoolean({ message: "Status ativo deve ser verdadeiro ou falso" })
  activeOnly?: boolean = true;
  @IsOptional()
  @IsBoolean({
    message: "Filtro de estoque baixo deve ser verdadeiro ou falso",
  })
  lowStock?: boolean = false;
  @IsOptional()
  @IsBoolean({ message: "Filtro sem estoque deve ser verdadeiro ou falso" })
  outOfStock?: boolean = false;
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Preço deve ter no máximo 2 casas decimais" },
  )
  @Min(0, { message: "Preço mínimo não pode ser negativo" })
  minPrice?: number;
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Preço deve ter no máximo 2 casas decimais" },
  )
  @Min(0, { message: "Preço máximo não pode ser negativo" })
  maxPrice?: number;
  @IsOptional()
  @IsBoolean({ message: "includeDeleted deve ser um boolean" })
  includeDeleted?: boolean = false;
  @IsOptional()
  @IsString({ message: "Campo de ordenação deve ser uma string" })
  sortBy?: "name" | "salePrice" | "stock" | "createdAt" = "name";
  @IsOptional()
  @IsString({ message: "Direção de ordenação deve ser uma string" })
  sortOrder?: "asc" | "desc" = "asc";
}
