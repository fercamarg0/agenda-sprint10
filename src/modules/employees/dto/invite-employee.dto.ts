import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
export class InviteEmployeeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
