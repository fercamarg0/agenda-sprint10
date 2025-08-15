import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
} from "class-validator";
export class UpdateReminderListDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
  @IsOptional()
  @IsHexColor()
  color?: string;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
}
