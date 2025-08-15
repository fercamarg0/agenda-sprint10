import {
  IsEmail,
  IsString,
  MinLength,
  IsUUID,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
export class CreateUserDto {
  @IsString({ message: "errors.validation.user.name.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.name.required" })
  name: string;
  @IsEmail({}, { message: "errors.validation.user.email.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.email.required" })
  email: string;
  @IsString({ message: "errors.validation.user.password.invalid" })
  @MinLength(6, { message: "errors.validation.user.password.min_length" })
  @IsNotEmpty({ message: "errors.validation.user.password.required" })
  password: string;
  @IsString({ message: "errors.validation.user.phone.invalid" })
  @IsOptional()
  phone?: string;
  @IsUUID()
  @IsOptional()
  roleId?: string;
  @IsString()
  @IsOptional()
  referralCode?: string;
  @IsUUID()
  @IsOptional()
  businessId?: string;
}
