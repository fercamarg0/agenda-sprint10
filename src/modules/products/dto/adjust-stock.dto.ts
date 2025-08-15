import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsNotIn,
} from "class-validator";

export class AdjustStockDto {
  @IsNotEmpty()
  @IsNumber()
  @IsNotIn([0], { message: "A quantidade nao pode ser zero." })
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
