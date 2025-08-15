import {
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { UpdateAddressDto } from "./update-address.dto";
export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: "errors.validation.profile.full_name.invalid" })
  fullName?: string;
  @IsOptional()
  @IsString({ message: "errors.validation.profile.phone.invalid" })
  phone?: string;
  @IsOptional()
  @IsDateString(undefined, {
    message: "errors.validation.profile.birth_date.invalid",
  })
  birthDate?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}
