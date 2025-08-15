import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
import { ProductSalesService } from "./product-sales.service";
import { CreateProductSaleDto } from "./dto/create-product-sale.dto";
import { UpdateProductSaleDto } from "./dto/update-product-sale.dto";
import { FindProductSalesDto } from "./dto/find-product-sales.dto";
import { Request } from "express";
@Controller("product-sales")
@UseGuards(AuthGuard("jwt"))
export class ProductSalesController {
  constructor(private readonly productSalesService: ProductSalesService) {}
  @Post()
  create(@Body() createDto: CreateProductSaleDto, @Req() req: RequestWithUser) {
    return this.productSalesService.create(
      createDto,
      req.user.businessId,
      req.user.sub,
    );
  }
  @Get()
  findAll(@Query() findDto: FindProductSalesDto, @Req() req: RequestWithUser) {
    return this.productSalesService.findAll(
      req.user.businessId,
      findDto,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productSalesService.findOne(id, req.user.businessId);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductSaleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productSalesService.update(
      id,
      updateDto,
      req.user.businessId,
      req.user.sub,
    );
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productSalesService.remove(id, req.user.businessId);
  }
}
