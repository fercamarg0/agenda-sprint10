import { IsEnum, IsOptional, IsString } from "class-validator";
export enum AnamneseFormStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}
export class UpdateAnamneseFormDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  terms?: string;
  @IsOptional()
  @IsEnum(AnamneseFormStatus)
  status?: AnamneseFormStatus;
}
