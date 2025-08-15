import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../prisma/prisma.service";
import { DeviceDto, DevicesResponseDto } from "../../dto/devices.response";
@Injectable()
export class DeviceManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async listUserDevices(
    userId: string,
    currentUserAgent: string,
  ): Promise<DevicesResponseDto> {
    const devices = await this.prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastUsedAt: "desc" },
    });
    return {
      devices: devices.map((device) => new DeviceDto(device, currentUserAgent)),
      totalCount: devices.length,
    };
  }
  async revokeDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.prisma.userDevice.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) {
      throw new NotFoundException(
        this.i18n.translate("errors.auth.device_not_found"),
      );
    }
    await this.prisma.$transaction([
      this.prisma.userDevice.delete({ where: { id: deviceId } }),
      this.prisma.user.update({
        where: { id: userId },
        data: { tokensRevokedAt: new Date() },
      }),
    ]);
  }
  async revokeAllDevices(
    userId: string,
    keepCurrentDevice = false,
    currentUserAgent?: string,
  ): Promise<void> {
    if (keepCurrentDevice && !currentUserAgent) {
      throw new BadRequestException(
        this.i18n.translate("errors.auth.missing_current_device"),
      );
    }
    const whereClause: Prisma.UserDeviceWhereInput = { userId };
    if (keepCurrentDevice && currentUserAgent) {
      whereClause.NOT = { userAgent: currentUserAgent };
    }
    await this.prisma.userDevice.deleteMany({ where: whereClause });
    await this.prisma.user.update({
      where: { id: userId },
      data: { tokensRevokedAt: new Date() },
    });
  }
}
