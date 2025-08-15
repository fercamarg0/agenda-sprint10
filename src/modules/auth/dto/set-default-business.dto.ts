import { IsUUID, IsNotEmpty } from "class-validator";
export class SetDefaultBusinessDto {
  @IsNotEmpty()
  @IsUUID()
  businessId: string;
}
