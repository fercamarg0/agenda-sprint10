import {
  IsEmail,
  IsString,
  MinLength,
  IsUUID,
  IsOptional,
} from "class-validator";
export class UpdateUserDto {
  @IsString({ message: "errors.validation.user.name.invalid" })
  @IsOptional()
  name?: string;
  @IsEmail({}, { message: "errors.validation.user.email.invalid" })
  @IsOptional()
  email?: string;
  @IsString({ message: "errors.validation.user.password.invalid" })
  @MinLength(6, { message: "errors.validation.user.password.min_length" })
  @IsOptional()
  password?: string;
  @IsString({ message: "errors.validation.user.document.invalid" })
  @IsOptional()
  document?: string;
  @IsString({ message: "errors.validation.user.phone.invalid" })
  @IsOptional()
  phone?: string;
  @IsUUID(undefined, { message: "errors.validation.user.role.invalid" })
  @IsOptional()
  roleId?: string;
  @IsUUID(undefined, { message: "errors.validation.user.company.invalid" })
  @IsOptional()
  companyId?: string;
}
