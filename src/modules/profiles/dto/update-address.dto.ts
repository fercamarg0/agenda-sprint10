import { IsString, IsOptional } from "class-validator";
export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  street?: string;
  @IsOptional()
  @IsString()
  number?: string;
  @IsOptional()
  @IsString()
  complement?: string;
  @IsOptional()
  @IsString()
  neighborhood?: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @IsString()
  state?: string;
  @IsOptional()
  @IsString()
  zipCode?: string;
}
