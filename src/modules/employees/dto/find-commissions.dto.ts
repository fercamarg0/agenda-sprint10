import { IsDateString, IsOptional } from "class-validator";
import { PaginationQueryDto } from "../../../shared/dto/pagination";
export class FindCommissionsDto extends PaginationQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
