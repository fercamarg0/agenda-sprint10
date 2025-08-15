import { Module } from "@nestjs/common";
import { FinancialRecordsController } from "./financial-records.controller";
import { FinancialRecordsService } from "./financial-records.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { SharedServicesModule } from "../../shared/services/shared-services.module";

@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [FinancialRecordsController],
  providers: [FinancialRecordsService],
  exports: [FinancialRecordsService],
})
export class FinancialRecordsModule {}
