import { IsNotEmpty, IsString, MaxLength } from "class-validator";
export class CreateProductCategoryDto {
  @IsNotEmpty({ message: "O nome da categoria é obrigatório" })
  @IsString({ message: "O nome deve ser uma string" })
  @MaxLength(255, { message: "O nome não pode ter mais de 255 caracteres" })
  name: string;
}
