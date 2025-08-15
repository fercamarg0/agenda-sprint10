import { Module } from "@nestjs/common";
import { AuthModule } from "../../../auth/auth.module";
import { ProductSalesController } from "./product-sales.controller";
import { ProductSalesService } from "./product-sales.service";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { SharedServicesModule } from "../../../../shared/services/shared-services.module";
@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [ProductSalesController],
  providers: [ProductSalesService],
  exports: [ProductSalesService],
})
export class ProductSalesModule {}
