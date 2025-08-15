import {
  IsUUID,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { EntityType } from "@prisma/client";
import { Type } from "class-transformer";
class UpdateAddressDto {
  @IsString()
  @IsOptional()
  street?: string;
  @IsString()
  @IsOptional()
  number?: string;
  @IsString()
  @IsOptional()
  complement?: string;
  @IsString()
  @IsOptional()
  neighborhood?: string;
  @IsString()
  @IsOptional()
  city?: string;
  @IsString()
  @IsOptional()
  state?: string;
  @IsString()
  @IsOptional()
  zipCode?: string;
}
export class UpdateCustomerDto {
  @IsOptional()
  @IsEnum(EntityType)
  customerType?: EntityType;
  @IsOptional()
  @IsString()
  displayName?: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  whatsapp?: string;
  @IsOptional()
  @IsEmail()
  email?: string | null;
  @IsOptional()
  @IsDateString()
  birthDate?: string | null;
  @IsOptional()
  @IsString()
  observations?: string | null;
  @IsOptional()
  @IsString()
  cpf?: string | null;
  @IsOptional()
  @IsString()
  cnpj?: string | null;
  @IsOptional()
  @IsUUID()
  addressId?: string | null;
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}
