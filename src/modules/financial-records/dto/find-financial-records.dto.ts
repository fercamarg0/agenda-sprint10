import { Transform, Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  IsNumber,
  IsPositive,
  Min,
} from "class-validator";
import {
  PaginationQueryDto,
  OrderDirection,
} from "../../../shared/dto/pagination/pagination-query.dto";
export class FindFinancialRecordsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(["income", "expense"])
  type?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minAmount?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxAmount?: number;
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  @IsIn(["date", "amount", "description", "createdAt"])
  orderBy = "date";
  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  orderDirection: OrderDirection = OrderDirection.DESC;
}
