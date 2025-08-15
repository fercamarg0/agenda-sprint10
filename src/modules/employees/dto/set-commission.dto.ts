import { IsNumber, IsPositive, Max } from "class-validator";
export class SetCommissionDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(100)
  percentage: number;
}
