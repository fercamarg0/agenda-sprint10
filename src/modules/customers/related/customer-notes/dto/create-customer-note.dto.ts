import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
export class CreateCustomerNoteDto {
  @IsUUID()
  @IsOptional()
  businessId: string;
  @IsUUID()
  @IsNotEmpty()
  customerId: string;
  @IsString()
  @IsNotEmpty()
  description: string;
}
