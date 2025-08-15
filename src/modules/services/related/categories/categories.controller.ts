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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FindServiceCategoriesDto } from "./dto/find-service-categories.dto";
import { Request } from "express";
@Controller("service-categories")
@UseGuards(AuthGuard("jwt"))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post()
  create(@Body() createDto: CreateCategoryDto, @Req() req: RequestWithUser) {
    return this.categoriesService.create(createDto, req.user);
  }
  @Get()
  findAll(
    @Query() findDto: FindServiceCategoriesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.findAll(
      req.user,
      findDto,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.categoriesService.findOne(id, req.user);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.update(id, updateDto, req.user);
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.categoriesService.remove(id, req.user);
  }
}
