import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  NotEquals,
} from "class-validator";
export enum StockMovementType {
  ENTRADA = "ENTRADA",
  SAIDA = "SAIDA",
  AJUSTE = "AJUSTE",
}
export class CreateProductStockMovementDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0, { message: "A quantidade nao pode ser zero." })
  quantity: number;
  @IsNotEmpty()
  @IsEnum(StockMovementType)
  movementType: StockMovementType;
  @IsOptional()
  @IsString()
  description?: string;
}
