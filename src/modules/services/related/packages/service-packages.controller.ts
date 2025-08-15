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
import { ServicePackagesService } from "./service-packages.service";
import { CreateServicePackageDto } from "./dto/create-service-package.dto";
import { UpdateServicePackageDto } from "./dto/update-service-package.dto";
import { FindServicePackagesDto } from "./dto/find-service-packages.dto";
import { Request } from "express";
@Controller("services/packages")
@UseGuards(AuthGuard("jwt"))
export class ServicePackagesController {
  constructor(
    private readonly servicePackagesService: ServicePackagesService,
  ) {}
  @Post()
  create(
    @Body() createDto: CreateServicePackageDto,
    @Req() req: RequestWithUser,
  ) {
    return this.servicePackagesService.create(createDto, req.user.businessId);
  }
  @Get()
  findAll(
    @Query() findDto: FindServicePackagesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.servicePackagesService.findAll(
      req.user.businessId,
      findDto,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.servicePackagesService.findOne(id, req.user.businessId);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateServicePackageDto,
    @Req() req: RequestWithUser,
  ) {
    return this.servicePackagesService.update(
      id,
      updateDto,
      req.user.businessId,
    );
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.servicePackagesService.remove(id, req.user.businessId);
  }
  @Get(":id/usage")
  getUsage(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return { message: "Endpoint 'getUsage' nao esta implementado no servico." };
  }
}
