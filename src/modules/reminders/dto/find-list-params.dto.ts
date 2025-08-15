import { IsUUID } from "class-validator";
export class FindListParamsDto {
  @IsUUID("4", { message: "O ID da lista fornecido não é um UUID válido." })
  listId: string;
}
