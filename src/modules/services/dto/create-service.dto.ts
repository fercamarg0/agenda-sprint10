import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateServiceDto {
  @IsString({ message: "errors.validation.service.name.invalid" })
  @IsNotEmpty({ message: "errors.validation.service.name.required" })
  name: string;

  @IsString({ message: "errors.validation.service.description.invalid" })
  @IsNotEmpty({ message: "errors.validation.service.description.required" })
  description: string;

  @IsNumber({}, { message: "errors.validation.service.duration.invalid" })
  @IsNotEmpty({ message: "errors.validation.service.duration.required" })
  duration: number;

  @IsNumber({}, { message: "errors.validation.service.price.invalid" })
  @IsNotEmpty({ message: "errors.validation.service.price.required" })
  price: number;

  @IsUUID(undefined, { message: "errors.validation.service.creator.invalid" })
  @IsNotEmpty({ message: "errors.validation.service.creator.required" })
  createdById: string;

  @IsUUID(undefined, { message: "errors.validation.service.updater.invalid" })
  @IsNotEmpty({ message: "errors.validation.service.updater.required" })
  updatedById: string;

  @IsOptional()
  @IsNumber({}, { message: "errors.validation.service.price_cost.invalid" })
  priceCost?: number;

  @IsOptional()
  @IsUUID(undefined, { message: "errors.validation.service.color.invalid" })
  colorId?: string;

  @IsBoolean({
    message: "errors.validation.service.online_scheduling.enabled.invalid",
  })
  @IsNotEmpty({
    message: "errors.validation.service.online_scheduling.enabled.required",
  })
  onlineSchedulingEnabled: boolean;

  @IsString({
    message:
      "errors.validation.service.online_scheduling.price_display.invalid",
  })
  @IsNotEmpty({
    message:
      "errors.validation.service.online_scheduling.price_display.required",
  })
  onlineSchedulingPriceDisplay: string;
}
