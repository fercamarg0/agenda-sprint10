import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from "class-validator";
export class UpdateBusinessRoleDto {
  @IsOptional()
  @IsString()
  value?: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissions?: string[];
}
