import { IsOptional, IsEnum, IsString, IsIn, IsUUID } from "class-validator";
import { ReminderItemPriority } from "@prisma/client";
import { PaginationQueryDto } from "../../../shared/dto/pagination/pagination-query.dto";
export enum ItemFilterType {
  ALL = "all",
  TODAY = "today",
  SCHEDULED = "scheduled",
  FLAGGED = "flagged",
  COMPLETED = "completed",
}
export class QueryReminderItemsDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID("4", { message: "O parâmetro listId deve ser um UUID válido." })
  listId?: string;
  @IsOptional()
  @IsEnum(ItemFilterType)
  filter?: ItemFilterType;
  @IsOptional()
  @IsEnum(ReminderItemPriority)
  priority?: ReminderItemPriority;
  @IsOptional()
  @IsString({ message: "isCompleted deve ser uma string." })
  @IsIn(["true", "false"], {
    message: 'isCompleted deve ser "true" ou "false".',
  })
  isCompleted?: string;
}
