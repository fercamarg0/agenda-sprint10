import { IsString } from "class-validator";
export class SignAnamneseRecordDto {
  @IsString()
  signature: string;
}
