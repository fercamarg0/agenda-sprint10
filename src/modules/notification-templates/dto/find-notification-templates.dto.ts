import { Transform, Type } from "class-transformer";
import { IsOptional, IsString, IsIn } from "class-validator";
import {
  PaginationQueryDto,
  OrderDirection,
} from "../../../shared/dto/pagination/pagination-query.dto";
export class FindNotificationTemplatesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(["INFO", "WARNING", "ERROR", "SUCCESS"])
  type?: string;
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  message?: string;
  @IsOptional()
  @IsString()
  variable?: string;
  @IsOptional()
  @IsString()
  @IsIn(["title", "type", "createdAt", "updatedAt"])
  orderBy = "createdAt";
  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  orderDirection: OrderDirection = OrderDirection.DESC;
}
