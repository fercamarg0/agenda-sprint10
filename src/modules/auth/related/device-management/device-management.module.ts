import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { DeviceManagementController } from "./device-management.controller";
import { DeviceManagementService } from "./device-management.service";
@Module({
  imports: [PrismaModule],
  controllers: [DeviceManagementController],
  providers: [DeviceManagementService],
  exports: [DeviceManagementService],
})
export class DeviceManagementModule {}
