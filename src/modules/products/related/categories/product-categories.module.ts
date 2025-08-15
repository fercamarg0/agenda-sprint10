import { Module } from "@nestjs/common";
import { AuthModule } from "../../../auth/auth.module";
import { ProductCategoriesService } from "./product-categories.service";
import { ProductCategoriesController } from "./product-categories.controller";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { SharedServicesModule } from "../../../../shared/services/shared-services.module";
@Module({
  imports: [PrismaModule, AuthModule, SharedServicesModule],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
