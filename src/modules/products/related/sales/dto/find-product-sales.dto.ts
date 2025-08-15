import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination/pagination-query.dto";
export class FindProductSalesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  customerId?: string;
  @IsOptional()
  @IsString()
  paymentMethod?: string;
  @IsOptional()
  @IsDateString()
  startDate?: string;
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
