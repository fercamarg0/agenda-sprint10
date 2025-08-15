import { IsString, MinLength, IsOptional } from "class-validator";
export class UpdateCategoryDto {
  @IsOptional()
  @IsString({
    message: "errors.validation.service_category.name.invalid_format",
  })
  @MinLength(2, {
    message: "errors.validation.service_category.name.too_short",
  })
  name?: string;
}
