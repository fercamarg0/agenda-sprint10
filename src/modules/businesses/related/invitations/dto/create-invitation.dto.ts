import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
export class CreateInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
  @IsOptional()
  @IsString()
  message?: string;
}
