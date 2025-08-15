import { Module } from "@nestjs/common";
import { AuthModule } from "../../../auth/auth.module";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { SharedServicesModule } from "../../../../shared/services/shared-services.module";
import { ProductPurchasesService } from "./product-purchases.service";
import { ProductPurchasesController } from "./product-purchases.controller";
@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [ProductPurchasesController],
  providers: [ProductPurchasesService],
  exports: [ProductPurchasesService],
})
export class ProductPurchasesModule {}
