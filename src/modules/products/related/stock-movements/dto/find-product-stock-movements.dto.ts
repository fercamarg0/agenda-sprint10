import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination";
import { StockMovementType } from "./create-product-stock-movement.dto";
export class FindProductStockMovementsDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  productId?: string;
  @IsOptional()
  @IsEnum(StockMovementType)
  movementType?: StockMovementType;
  @IsOptional()
  @IsDateString()
  startDate?: string;
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
