import {
  IsUUID,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { EntityType } from "@prisma/client";
import { Type } from "class-transformer";
class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;
  @IsString()
  @IsNotEmpty()
  number: string;
  @IsString()
  @IsOptional()
  complement?: string;
  @IsString()
  @IsNotEmpty()
  neighborhood: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  state: string;
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}
export class CreateCustomerDto {
  @IsUUID()
  @IsOptional()
  businessId: string;
  @IsEnum(EntityType)
  @IsNotEmpty()
  customerType: EntityType;
  @IsString()
  @IsNotEmpty()
  displayName: string;
  @IsString()
  @IsOptional()
  phone?: string;
  @IsOptional()
  @IsString()
  whatsapp?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsDateString()
  birthDate?: string;
  @IsOptional()
  @IsString()
  observations?: string;
  @IsOptional()
  @IsString()
  cpf?: string;
  @IsOptional()
  @IsString()
  cnpj?: string;
  @IsOptional()
  @IsUUID()
  addressId?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}
