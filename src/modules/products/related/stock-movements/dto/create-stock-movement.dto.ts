import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from "class-validator";
export class CreateStockMovementDto {
  @IsNotEmpty({ message: "ID do produto é obrigatório" })
  @IsUUID("4", { message: "ID do produto deve ser um UUID válido" })
  productId: string;
  @IsNotEmpty({ message: "Quantidade é obrigatória" })
  @IsNumber({}, { message: "Quantidade deve ser um número" })
  @Min(1, { message: "Quantidade deve ser maior que zero" })
  quantity: number;
  @IsNotEmpty({ message: "Tipo de movimentação é obrigatório" })
  @IsEnum(["ENTRADA", "SAIDA", "AJUSTE"], {
    message: "Tipo deve ser ENTRADA, SAIDA ou AJUSTE",
  })
  movementType: "ENTRADA" | "SAIDA" | "AJUSTE";
  @IsNotEmpty({ message: "Descrição é obrigatória" })
  @IsString({ message: "Descrição deve ser um texto" })
  description: string;
  @IsOptional()
  @IsDateString({}, { message: "Data deve estar no formato ISO válido" })
  date?: string;
  @IsOptional()
  @IsString({ message: "Observações devem ser um texto" })
  observations?: string;
}
