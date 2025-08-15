import { IsString, IsNotEmpty, Length } from "class-validator";
export class ChangePasswordDto {
  @IsString({ message: "errors.validation.user.password.current.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.password.current.required" })
  currentPassword: string;
  @IsString({ message: "errors.validation.user.password.new.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.password.new.required" })
  @Length(8, 100, { message: "errors.validation.user.password.new.length" })
  newPassword: string;
}
