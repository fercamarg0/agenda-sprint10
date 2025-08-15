import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Put,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto, FindProductsDto } from "./dto";
import { AdjustStockDto } from "./dto/adjust-stock.dto";
@Controller("products")
@UseGuards(AuthGuard("jwt"))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productsService.create(
      createProductDto,
      req.user.businessId,
      req.user.sub,
    );
  }
  @Get()
  findAll(
    @Query() findProductsDto: FindProductsDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productsService.findAll(
      req.user.businessId,
      findProductsDto,
      req,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productsService.findOne(id, req.user.businessId);
  }
  @Put(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productsService.update(
      id,
      updateProductDto,
      req.user.businessId,
      req.user.sub,
    );
  }
  @Patch(":id/adjust-stock")
  adjustStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() adjustStockDto: AdjustStockDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productsService.adjustStock(
      id,
      adjustStockDto.quantity,
      req.user.businessId,
      req.user.sub,
      adjustStockDto.reason,
    );
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productsService.remove(id, req.user.businessId, req.user.sub);
  }
}
