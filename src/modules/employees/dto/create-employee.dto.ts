import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from "class-validator";
export class CreateEmployeeDto {
  @IsString({ message: "errors.validation.employee.name.invalid" })
  @IsNotEmpty({ message: "errors.validation.employee.name.required" })
  name: string;
  @IsEmail({}, { message: "errors.validation.employee.email.invalid" })
  @IsNotEmpty({ message: "errors.validation.employee.email.required" })
  email: string;
  @IsString({ message: "errors.validation.user.phone.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.phone.required" })
  phone: string;

  @IsString({ message: "errors.validation.user.password.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.password.required" })
  @MinLength(8, { message: "errors.validation.user.password.minLength" })
  password: string;
  @IsUUID(undefined, { message: "errors.validation.user.roleId.invalid" })
  @IsNotEmpty({ message: "errors.validation.user.roleId.required" })
  roleId: string;
}
