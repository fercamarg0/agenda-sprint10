import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from "class-validator";
export class CreateAnamneseAnswerDetailDto {
  @IsUUID()
  anamneseQuestionId: string;
  @IsOptional()
  @IsBoolean()
  booleanAnswer?: boolean;
  @IsOptional()
  @IsString()
  textAnswer?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  anamneseQuestionItemIds?: string[];
}
export class CreateAnamneseRecordDto {
  @IsUUID()
  anamneseFormId: string;
  @IsOptional()
  @IsString()
  comments?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnamneseAnswerDetailDto)
  answersDetails: CreateAnamneseAnswerDetailDto[];
}
