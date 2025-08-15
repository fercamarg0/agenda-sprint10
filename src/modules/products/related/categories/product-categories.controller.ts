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
import { ProductCategoriesService } from "./product-categories.service";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { FindProductCategoriesDto } from "./dto/find-product-categories.dto";
import { Request } from "express";
@Controller("product-categories")
@UseGuards(AuthGuard("jwt"))
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}
  @Post()
  create(
    @Body() createDto: CreateProductCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productCategoriesService.create(
      createDto,
      req.user.businessId,
      req.user.sub,
    );
  }
  @Get()
  findAll(
    @Query() findDto: FindProductCategoriesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productCategoriesService.findAll(
      req.user.businessId,
      findDto,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productCategoriesService.findOne(id, req.user.businessId);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productCategoriesService.update(
      id,
      updateDto,
      req.user.businessId,
      req.user.sub,
    );
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.productCategoriesService.remove(
      id,
      req.user.businessId,
      req.user.sub,
    );
  }
}
