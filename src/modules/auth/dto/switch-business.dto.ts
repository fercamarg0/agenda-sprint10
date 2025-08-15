import { IsNotEmpty, IsUUID } from "class-validator";
export class SwitchBusinessDto {
  @IsUUID()
  @IsNotEmpty()
  businessId: string;
}
