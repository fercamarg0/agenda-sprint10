import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  MaxLength,
} from "class-validator";
import { ReminderItemPriority } from "@prisma/client";
export class UpdateReminderItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
  @IsOptional()
  @IsDateString()
  dueDate?: string;
  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;
  @IsOptional()
  @IsEnum(ReminderItemPriority)
  priority?: ReminderItemPriority;
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;
}
