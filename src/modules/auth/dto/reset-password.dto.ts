import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isPasswordMatching", async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordConfirmation: string, args: ValidationArguments) {
    const object = args.object as ResetPasswordDto;
    return object.password === passwordConfirmation;
  }

  defaultMessage() {
    return "auth.validation.passwords_do_not_match";
  }
}

export class ResetPasswordDto {
  @IsString({ message: "auth.validation.invalid_token" })
  @IsNotEmpty({ message: "auth.validation.token_required" })
  token: string;

  @IsString()
  @MinLength(8, { message: "auth.validation.password_min_length" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: "auth.validation.password_complexity",
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty({ message: "auth.validation.password_confirmation_required" })
  @Validate(IsPasswordMatchingConstraint)
  passwordConfirmation: string;
}
