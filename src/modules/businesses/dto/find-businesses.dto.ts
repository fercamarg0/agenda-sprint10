import { IsOptional, IsEnum } from "class-validator";
import { PaginationQueryDto } from "../../../shared/dto/pagination/pagination-query.dto";
import { EntityType } from "@prisma/client";
export class FindBusinessesDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(EntityType)
  entityType?: EntityType;
}
