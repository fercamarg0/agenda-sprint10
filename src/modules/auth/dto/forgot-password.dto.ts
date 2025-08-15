import { IsEmail, IsNotEmpty } from "class-validator";
export class ForgotPasswordDto {
  @IsEmail({}, { message: "auth.validation.invalid_email" })
  @IsNotEmpty({ message: "auth.validation.email_required" })
  email: string;
}
