import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: "O codigo de verificacao deve ter 4 digitos." })
  code: string;
}
