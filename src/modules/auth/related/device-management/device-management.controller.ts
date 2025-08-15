import {
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
import { DeviceManagementService } from "./device-management.service";
import { OptionalParseUUIDPipe } from "../../../../shared/pipes/optional-parse-uuid.pipe";

@UseGuards(AuthGuard("jwt"))
@Controller("auth/devices")
export class DeviceManagementController {
  constructor(
    private readonly deviceManagementService: DeviceManagementService,
  ) {}

  @Get()
  async listDevices(@Req() req: RequestWithUser) {
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.deviceManagementService.listUserDevices(req.user.id, userAgent);
  }

  @Delete(":deviceId")
  @HttpCode(HttpStatus.OK)
  async disconnectDevice(
    @Req() req: RequestWithUser,
    @Param("deviceId", OptionalParseUUIDPipe) deviceId: string,
  ) {
    return this.deviceManagementService.revokeDevice(req.user.id, deviceId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async disconnectAllOtherDevices(@Req() req: RequestWithUser) {
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.deviceManagementService.revokeAllDevices(
      req.user.id,
      true,
      userAgent,
    );
  }
}
