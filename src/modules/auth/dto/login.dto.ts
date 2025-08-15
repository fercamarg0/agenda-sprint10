import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "errors.validation.user.email.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.email.required" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "errors.validation.user.password.required" })
  password: string;
}
