import { IsEmail, IsNotEmpty } from "class-validator";
export class ResendVerificationEmailDto {
  @IsEmail({}, { message: "errors.validation.user.email.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.email.required" })
  email: string;
}
