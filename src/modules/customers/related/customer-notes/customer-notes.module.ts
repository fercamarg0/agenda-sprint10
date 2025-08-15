import { Module } from "@nestjs/common";
import { CustomerNotesService } from "./customer-notes.service";
import { CustomerNotesController } from "./customer-notes.controller";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { SharedServicesModule } from "../../../../shared/services/shared-services.module";
import { AuthModule } from "../../../auth/auth.module";
@Module({
  imports: [PrismaModule, SharedServicesModule, AuthModule],
  controllers: [CustomerNotesController],
  providers: [CustomerNotesService],
  exports: [CustomerNotesService],
})
export class CustomerNotesModule {}
