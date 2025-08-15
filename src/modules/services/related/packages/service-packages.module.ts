import { Module } from "@nestjs/common";
import { AuthModule } from "../../../auth/auth.module";
import { ServicePackagesController } from "./service-packages.controller";
import { ServicePackagesService } from "./service-packages.service";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { SharedServicesModule } from "../../../../shared/services/shared-services.module";
@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [ServicePackagesController],
  providers: [ServicePackagesService],
  exports: [ServicePackagesService],
})
export class ServicePackagesModule {}
