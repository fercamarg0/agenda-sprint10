import { IsUUID } from "class-validator";
export class ListIdParamsDto {
  @IsUUID("4", { message: "O ID da lista fornecido não é um UUID válido." })
  listId: string;
}
export class ItemIdParamsDto {
  @IsUUID("4", { message: "O ID do item fornecido não é um UUID válido." })
  itemId: string;
}
export class IdParamsDto {
  @IsUUID("4", { message: "O ID fornecido não é um UUID válido." })
  id: string;
}
