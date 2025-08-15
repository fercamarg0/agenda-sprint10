import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class VerifyEmailDto {
  @IsEmail({}, { message: "Forneça um endereço de e-mail válido." })
  @IsNotEmpty({ message: "O e-mail é obrigatório." })
  email: string;
  @IsString()
  @IsNotEmpty()
  code: string;
}
