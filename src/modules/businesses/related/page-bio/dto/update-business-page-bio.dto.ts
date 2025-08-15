import {
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsUUID,
  ValidateIf,
} from "class-validator";
export class UpdateBusinessPageBioDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
  @IsOptional()
  @IsString()
  @MaxLength(255)
  headerText?: string;
  @IsOptional()
  @IsString()
  avatarUrl?: string;
  @IsOptional()
  @IsUUID()
  backgroundColorId?: string;
  @IsOptional()
  @IsUUID()
  borderColorId?: string;
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;
  @IsOptional()
  @IsBoolean()
  onlineSchedulingAvailable?: boolean;

  @ValidateIf(
    (o: UpdateBusinessPageBioDto) => o.onlineSchedulingAvailable === true,
  )
  @IsString()
  @MaxLength(50)
  onlineSchedulingSlug?: string;
}
