import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
} from "class-validator";
import { ReminderItemPriority } from "@prisma/client";
import { IsOptionalEnumField } from "../../../shared/decorators/enum-validation.decorator";

export class CreateReminderItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @IsOptionalEnumField(ReminderItemPriority)
  priority?: ReminderItemPriority;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;
}
