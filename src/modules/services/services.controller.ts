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
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { FindServicesDto } from "./dto/find-services.dto";
@Controller("services")
@UseGuards(AuthGuard("jwt"))
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.servicesService.create(createServiceDto, req.user);
  }
  @Get()
  findAll(
    @Query() findServicesDto: FindServicesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.servicesService.findAll(req.user, findServicesDto, req);
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.servicesService.findOne(id, req.user);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.servicesService.update(id, updateServiceDto, req.user);
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.servicesService.remove(id, req.user);
  }
}
