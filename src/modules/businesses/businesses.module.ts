import { Module } from "@nestjs/common";
import { BusinessesController } from "./businesses.controller";
import { BusinessesService } from "./businesses.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { SharedServicesModule } from "../../shared/services/shared-services.module";

@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
