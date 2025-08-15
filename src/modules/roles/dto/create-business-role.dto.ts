import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from "class-validator";
export class CreateBusinessRoleDto {
  @IsString()
  value: string;
  @IsString()
  name: string;
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissions: string[];
}
