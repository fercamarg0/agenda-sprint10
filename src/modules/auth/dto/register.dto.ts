import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
export class RegisterDto {
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
  @IsString({ message: "errors.validation.user.document.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.document.required" })
  document: string;
  @IsString({ message: "errors.validation.user.phone.invalid" })
  @IsOptional()
  phone?: string;
  @IsString()
  @IsOptional()
  referralCode?: string;
}
