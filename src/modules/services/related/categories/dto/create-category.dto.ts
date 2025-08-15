import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsString({
    message: "errors.validation.service_category.name.invalid_type",
  })
  @IsNotEmpty({
    message: "errors.validation.service_category.name.is_empty",
  })
  @MinLength(2, {
    message: "errors.validation.service_category.name.min_length",
  })
  name: string;
}
