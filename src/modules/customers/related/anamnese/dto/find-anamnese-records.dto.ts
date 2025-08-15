import { PaginationQueryDto } from "../../../../../shared/dto/pagination";
export class FindAnamneseRecordsDto extends PaginationQueryDto {
  declare search?: string;
}
