import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection: OrderDirection = OrderDirection.DESC;
  @IsOptional()
  @IsString()
  orderBy = "createdAt";
  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
