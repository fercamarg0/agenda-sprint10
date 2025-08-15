import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  MaxLength,
  IsDecimal,
} from "class-validator";
import { Transform } from "class-transformer";
export class CreateProductDto {
  @IsNotEmpty({ message: "O nome do produto é obrigatório" })
  @IsString({ message: "O nome deve ser uma string" })
  @MaxLength(255, { message: "O nome não pode ter mais de 255 caracteres" })
  name: string;
  @IsNotEmpty({ message: "O preço de venda é obrigatório" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Preço deve ter no máximo 2 casas decimais" },
  )
  @Min(0.01, { message: "O preço deve ser maior que zero" })
  salePrice: number;
  @IsNotEmpty({ message: "O preço de custo é obrigatório" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Preço deve ter no máximo 2 casas decimais" },
  )
  @Min(0, { message: "O preço de custo não pode ser negativo" })
  price: number;
  @IsNotEmpty({ message: "A categoria é obrigatória" })
  @IsUUID(4, { message: "ID da categoria deve ser um UUID válido" })
  productCategoryId: string;
  @IsNotEmpty({ message: "A quantidade desejada em estoque é obrigatória" })
  @IsNumber({}, { message: "Quantidade desejada deve ser um número" })
  @Min(0, { message: "Quantidade desejada não pode ser negativa" })
  desiredStockAmount: number;
  @IsNotEmpty({ message: "A quantidade atual em estoque é obrigatória" })
  @IsNumber({}, { message: "Quantidade em estoque deve ser um número" })
  @Min(0, { message: "Quantidade em estoque não pode ser negativa" })
  stock: number;
  @IsOptional()
  @IsUrl({}, { message: "URL da imagem deve ser válida" })
  imageUrl?: string;

  @IsOptional()
  @IsString({ message: "A descrição deve ser uma string" })
  @MaxLength(1000, {
    message: "A descrição não pode ter mais de 1000 caracteres",
  })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: "Status ativo deve ser verdadeiro ou falso" })
  active?: boolean = true;
}
