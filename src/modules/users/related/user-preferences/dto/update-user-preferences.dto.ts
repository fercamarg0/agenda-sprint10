import { IsOptional, IsString, Length } from "class-validator";
export class UpdateUserPreferencesDto {
  @IsString()
  @IsOptional()
  language?: string;
  @IsString()
  @IsOptional()
  @Length(3, 3, { message: "Currency must be a 3-letter ISO code" })
  currency?: string;
  @IsString()
  @IsOptional()
  timezone?: string;
  @IsString()
  @IsOptional()
  theme?: string;
}
