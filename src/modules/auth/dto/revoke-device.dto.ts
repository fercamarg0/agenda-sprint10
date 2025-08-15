import { IsNotEmpty, IsUUID } from "class-validator";
export class RevokeDeviceDto {
  @IsUUID()
  @IsNotEmpty()
  deviceId: string;
}
