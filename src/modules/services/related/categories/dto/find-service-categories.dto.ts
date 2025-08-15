import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination/pagination-query.dto";
export class FindServiceCategoriesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
