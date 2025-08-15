import { IsNotEmpty, IsUUID } from "class-validator";
export class SetDefaultBusinessDto {
  @IsNotEmpty()
  @IsUUID()
  businessId: string;
}
