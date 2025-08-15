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
import { ProductPurchasesService } from "./product-purchases.service";
import { CreateProductPurchaseDto } from "./dto/create-product-purchase.dto";
import { UpdateProductPurchaseDto } from "./dto/update-product-purchase.dto";
import { FindProductPurchasesDto } from "./dto/find-product-purchases.dto";
import { Request } from "express";
@Controller("product-purchases")
@UseGuards(AuthGuard("jwt"))
export class ProductPurchasesController {
  constructor(
    private readonly productPurchasesService: ProductPurchasesService,
  ) {}
  @Post()
  create(
    @Body() createDto: CreateProductPurchaseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productPurchasesService.create(createDto, req.user);
  }
  @Get()
  findAll(
    @Query() findDto: FindProductPurchasesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productPurchasesService.findAll(
      findDto,
      req.user,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productPurchasesService.findOne(id, req.user);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductPurchaseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productPurchasesService.update(id, updateDto, req.user);
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productPurchasesService.remove(id, req.user);
  }
}
