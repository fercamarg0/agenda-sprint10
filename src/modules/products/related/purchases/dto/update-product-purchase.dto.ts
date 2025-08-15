import { PartialType } from "@nestjs/mapped-types";
import { CreateProductPurchaseDto } from "./create-product-purchase.dto";

export class UpdateProductPurchaseDto extends PartialType(
  CreateProductPurchaseDto,
) {}
