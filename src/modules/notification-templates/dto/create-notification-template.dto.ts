import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsIn,
  MaxLength,
} from "class-validator";

export class CreateNotificationTemplateDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["INFO", "WARNING", "ERROR", "SUCCESS"], {
    message: "Tipo deve ser INFO, WARNING, ERROR ou SUCCESS",
  })
  type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: "Título deve ter no máximo 100 caracteres" })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: "Mensagem deve ter no máximo 1000 caracteres" })
  message: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Descrição deve ter no máximo 255 caracteres" })
  description?: string;
}
