import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
class ProductSaleItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice: number;
}
export class CreateProductSaleDto {
  @IsOptional()
  @IsString()
  customerId?: string;
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSaleItemDto)
  items: ProductSaleItemDto[];
  @IsOptional()
  @IsString()
  notes?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}
