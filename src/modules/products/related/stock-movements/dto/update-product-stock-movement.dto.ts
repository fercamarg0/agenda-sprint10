import { IsOptional, IsString } from "class-validator";
export class UpdateProductStockMovementDto {
  @IsOptional()
  @IsString()
  description?: string;
}
