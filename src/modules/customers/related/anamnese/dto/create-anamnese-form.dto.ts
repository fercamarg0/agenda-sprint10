import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { AnamneseQuestionType } from "../enums/question-types.enum";
export class CreateAnamneseQuestionDto {
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  sectionTitle?: string;
  @IsString()
  questionType: string;
  @IsOptional()
  booleanWithDetails?: boolean;
  @IsOptional()
  required?: boolean = false;
  @IsOptional()
  @IsUUID()
  otherItemId?: string;
  @IsOptional()
  section?: boolean = false;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionItems?: string[];
}
export class CreateAnamneseFormDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  terms?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnamneseQuestionDto)
  questions: CreateAnamneseQuestionDto[];
}
