import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateIf,
} from "class-validator";
import { EntityType } from "@prisma/client";
import { IsEnumField } from "../../../shared/decorators/enum-validation.decorator";
import { ENTITY_TYPE_MAP } from "../../../shared/enums";
export class CreateBusinessDto {
  @IsString({ message: "errors.validation.company.name.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.name.required" })
  name: string;
  @IsEmail({}, { message: "errors.validation.company.email.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.email.required" })
  email: string;
  @IsEnumField(EntityType, {})
  entityType: EntityType;
  @ValidateIf((o: CreateBusinessDto) => o.entityType === EntityType.PERSON)
  @IsNotEmpty({ message: "errors.validation.company.cpf.requiredForPF" })
  @IsString({ message: "errors.validation.company.cpf.invalid" })
  @IsOptional()
  cpf?: string;
  @ValidateIf((o: CreateBusinessDto) => o.entityType === EntityType.CORPORATION)
  @IsNotEmpty({ message: "errors.validation.company.cnpj.requiredForPJ" })
  @IsString({ message: "errors.validation.company.cnpj.invalid" })
  @IsOptional()
  cnpj?: string;
  @IsString({ message: "errors.validation.company.phone.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.phone.required" })
  phone: string;
  @IsString({ message: "errors.validation.company.address.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.address.required" })
  address: string;
  @IsString({ message: "errors.validation.company.number.invalid" })
  @IsOptional()
  number?: string;
  @IsString({ message: "errors.validation.company.complement.invalid" })
  @IsOptional()
  complement?: string;
  @IsString({ message: "errors.validation.company.neighborhood.invalid" })
  @IsOptional()
  neighborhood?: string;
  @IsString({ message: "errors.validation.company.city.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.city.required" })
  city: string;
  @IsString({ message: "errors.validation.company.state.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.state.required" })
  state: string;
  @IsString({ message: "errors.validation.company.zip_code.invalid" })
  @IsNotEmpty({ message: "errors.validation.company.zip_code.required" })
  zipCode: string;
  @IsOptional()
  @IsString({ message: "errors.validation.company.website.invalid" })
  website?: string;
  @IsOptional()
  @IsString({ message: "errors.validation.company.description.invalid" })
  description?: string;
}
