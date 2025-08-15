import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PaginationService } from "./pagination.service";
import { ApiConfigService } from "./api-config.service";
import { AuditService } from "./audit.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [PaginationService, ApiConfigService, AuditService],
  exports: [PaginationService, ApiConfigService, AuditService],
})
export class SharedServicesModule {}
