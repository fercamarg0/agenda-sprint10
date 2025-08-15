import { IsOptional, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination/pagination-query.dto";

export class FindServicePackagesDto extends PaginationQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  active?: boolean = true;
}
