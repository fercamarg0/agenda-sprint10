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
import { ProductStockMovementsService } from "./product-stock-movements.service";
import { CreateProductStockMovementDto } from "./dto/create-product-stock-movement.dto";
import { UpdateProductStockMovementDto } from "./dto/update-product-stock-movement.dto";
import { FindProductStockMovementsDto } from "./dto/find-product-stock-movements.dto";
import { Request } from "express";
@Controller("product-stock-movements")
@UseGuards(AuthGuard("jwt"))
export class ProductStockMovementsController {
  constructor(
    private readonly productStockMovementsService: ProductStockMovementsService,
  ) {}
  @Post()
  create(
    @Body() createDto: CreateProductStockMovementDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productStockMovementsService.create(dto, req.user);
  }
  @Get()
  findAll(
    @Query() findDto: FindProductStockMovementsDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productStockMovementsService.findAll(
      findDto,
      req.user,
      req as unknown as Request,
    );
  }
  @Get("summary/:productId")
  getStockSummary(
    @Param("productId", ParseUUIDPipe) productId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.productStockMovementsService.getStockSummary(
      productId,
      req.user,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productStockMovementsService.findOne(id, req.user);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductStockMovementDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productStockMovementsService.update(id, updateDto, req.user);
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productStockMovementsService.remove(id, req.user);
  }
}
