import {
  IsString,
  IsNotEmpty,
  IsHexColor,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
} from "class-validator";
export class CreateReminderListDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
}
