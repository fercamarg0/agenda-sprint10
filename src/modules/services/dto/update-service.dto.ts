import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class UpdateServiceDto {
  @IsOptional()
  @IsUUID(undefined, { message: "errors.validation.service.updater.invalid" })
  updatedById?: string;

  @IsOptional()
  @IsString({ message: "errors.validation.service.name.invalid" })
  name?: string;

  @IsOptional()
  @IsString({ message: "errors.validation.service.description.invalid" })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "errors.validation.service.duration.invalid" })
  duration?: number;

  @IsOptional()
  @IsNumber({}, { message: "errors.validation.service.price.invalid" })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: "errors.validation.service.price_cost.invalid" })
  priceCost?: number;

  @IsOptional()
  @IsUUID(undefined, { message: "errors.validation.service.color.invalid" })
  colorId?: string;

  @IsOptional()
  @IsBoolean({
    message: "errors.validation.service.online_scheduling.enabled.invalid",
  })
  onlineSchedulingEnabled?: boolean;

  @IsOptional()
  @IsString({
    message:
      "errors.validation.service.online_scheduling.price_display.invalid",
  })
  onlineSchedulingPriceDisplay?: string;

  @IsOptional()
  @IsUUID(undefined, { message: "errors.validation.service.company.invalid" })
  companyId?: string;
}
