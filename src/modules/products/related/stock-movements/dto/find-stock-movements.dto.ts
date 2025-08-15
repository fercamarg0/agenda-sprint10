import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "../../../../../shared/dto/pagination/pagination-query.dto";
export class FindStockMovementsDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID("4", { message: "ID do produto deve ser um UUID válido" })
  productId?: string;
  @IsOptional()
  @IsEnum(["ENTRADA", "SAIDA", "AJUSTE"], {
    message: "Tipo deve ser ENTRADA, SAIDA ou AJUSTE",
  })
  movementType?: "ENTRADA" | "SAIDA" | "AJUSTE";
  @IsOptional()
  @IsDateString(
    {},
    { message: "Data deve estar no formato válido (YYYY-MM-DD)" },
  )
  startDate?: string;
  @IsOptional()
  @IsDateString(
    {},
    { message: "Data deve estar no formato válido (YYYY-MM-DD)" },
  )
  endDate?: string;
}
