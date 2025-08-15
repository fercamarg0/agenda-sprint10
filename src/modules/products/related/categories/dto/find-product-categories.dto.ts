import { Transform } from "class-transformer";
import { IsOptional, IsString, IsBoolean } from "class-validator";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination/pagination-query.dto";
export class FindProductCategoriesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: "O nome deve ser uma string" })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: "includeDeleted deve ser um boolean" })
  includeDeleted?: boolean = false;
}
