import { IsUUID, IsString, IsOptional, IsDateString } from "class-validator";
export class CreateProfileDto {
  @IsUUID(undefined, { message: "errors.validation.profile.user.invalid" })
  userId: string;
  @IsString({ message: "errors.validation.profile.full_name.invalid" })
  fullName: string;
  @IsOptional()
  @IsString({ message: "errors.validation.profile.phone.invalid" })
  phone?: string;
  @IsOptional()
  @IsDateString(undefined, {
    message: "errors.validation.profile.birth_date.invalid",
  })
  birthDate?: string;
  @IsOptional()
  @IsUUID(undefined, { message: "errors.validation.profile.address.invalid" })
  addressId?: string;
}
