import { UserDevice } from "@prisma/client";
export class DeviceDto {
  id: string;
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
  region?: string;
  lastUsedAt: Date;
  createdAt: Date;
  isCurrentDevice: boolean;
  constructor(device: UserDevice, currentDeviceUserAgent?: string) {
    this.id = device.id;
    this.ipAddress = device.ipAddress;
    this.userAgent = device.userAgent;
    this.country = device.country ?? undefined;
    this.city = device.city ?? undefined;
    this.region = device.region ?? undefined;
    this.lastUsedAt = device.lastUsedAt;
    this.createdAt = device.createdAt;
    this.isCurrentDevice = currentDeviceUserAgent === device.userAgent;
  }
}
export class DevicesResponseDto {
  devices: DeviceDto[];
  totalCount: number;
}
