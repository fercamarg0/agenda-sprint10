import { Module } from "@nestjs/common";
import { AuthModule } from "../../../auth/auth.module";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { SharedServicesModule } from "../../../../shared/services/shared-services.module";
import { ProductStockMovementsService } from "./product-stock-movements.service";
import { ProductStockMovementsController } from "./product-stock-movements.controller";
@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [ProductStockMovementsController],
  providers: [ProductStockMovementsService],
  exports: [ProductStockMovementsService],
})
export class ProductStockMovementsModule {}
