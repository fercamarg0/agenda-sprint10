import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
  IsEnum,
} from "class-validator";
import { Transform, Type } from "class-transformer";
export class CreateProductPurchaseItemDto {
  @IsNotEmpty({ message: "O ID do produto é obrigatório" })
  @IsUUID(4, { message: "ID do produto deve ser um UUID válido" })
  productId: string;
  @IsNotEmpty({ message: "A quantidade é obrigatória" })
  @IsNumber({}, { message: "Quantidade deve ser um número" })
  @Min(1, { message: "Quantidade deve ser maior que zero" })
  quantity: number;
  @IsNotEmpty({ message: "O preço unitário é obrigatório" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Preço deve ter no máximo 2 casas decimais" },
  )
  @Min(0.01, { message: "Preço unitário deve ser maior que zero" })
  unitPrice: number;
  @IsNotEmpty({ message: "O preço total é obrigatório" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Preço deve ter no máximo 2 casas decimais" },
  )
  @Min(0.01, { message: "Preço total deve ser maior que zero" })
  totalPrice: number;
}
export class CreateProductPurchaseDto {
  @IsNotEmpty({ message: "O ID do fornecedor é obrigatório" })
  @IsUUID(4, { message: "ID do fornecedor deve ser um UUID válido" })
  productSupplierId: string;

  @IsNotEmpty({ message: "A data da compra é obrigatória" })
  @IsDateString(
    {},
    { message: "Data deve estar no formato válido (YYYY-MM-DD)" },
  )
  purchaseDate: string;
  @IsNotEmpty({ message: "O valor total da compra é obrigatório" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Valor deve ter no máximo 2 casas decimais" },
  )
  @Min(0.01, { message: "Valor total deve ser maior que zero" })
  value: number;

  @IsNotEmpty({ message: "O método de pagamento é obrigatório" })
  @IsEnum(
    [
      "CASH",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "PIX",
      "BANK_TRANSFER",
      "CHECK",
      "INSTALLMENTS",
    ],
    {
      message: "Método de pagamento inválido",
    },
  )
  paymentMethod: string;
  @IsOptional()
  @IsNumber({}, { message: "Número de parcelas deve ser um número" })
  @Min(1, { message: "Número de parcelas deve ser maior que zero" })
  installmentTotal?: number;
  @IsOptional()
  @IsString({ message: "A descrição deve ser uma string" })
  @MaxLength(1000, {
    message: "A descrição não pode ter mais de 1000 caracteres",
  })
  description?: string;
  @IsNotEmpty({ message: "A lista de itens é obrigatória" })
  @IsArray({ message: "Itens deve ser um array" })
  @ValidateNested({ each: true })
  @Type(() => CreateProductPurchaseItemDto)
  items: CreateProductPurchaseItemDto[];
}
