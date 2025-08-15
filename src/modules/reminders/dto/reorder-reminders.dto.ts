import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";
export class MoveReminderDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  newOrder: number;
}
