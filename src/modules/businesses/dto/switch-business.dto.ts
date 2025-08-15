import { IsNotEmpty, IsString, IsUUID } from "class-validator";
export class SwitchBusinessDto {
  @IsNotEmpty({ message: "errors.validation.business.id.required" })
  @IsString({ message: "errors.validation.business.id.invalid" })
  @IsUUID("4", { message: "errors.validation.business.id.invalid" })
  businessId: string;
}
