import {
  IsUUID,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
} from "class-validator";
export class UpdateEmployeeDto {
  @IsString({ message: "errors.validation.user.name.invalid" })
  @IsOptional()
  name?: string;
  @IsEmail({}, { message: "errors.validation.user.email.invalid" })
  @IsOptional()
  email?: string;
  @IsString({ message: "errors.validation.user.phone.invalid" })
  @IsOptional()
  phone?: string;
  @IsString({ message: "errors.validation.user.password.invalid" })
  @MinLength(8, { message: "errors.validation.user.password.minLength" })
  @IsOptional()
  password?: string;
  @IsUUID(undefined, { message: "errors.validation.user.roleId.invalid" })
  @IsOptional()
  roleId?: string;
}
