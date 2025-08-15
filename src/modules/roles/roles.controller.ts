import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateBusinessRoleDto } from "./dto/create-business-role.dto";
import { UpdateBusinessRoleDto } from "./dto/update-business-role.dto";
import { FindRolesDto } from "./dto/find-roles.dto";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { Request } from "express";
@Controller("roles")
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  async create(@Body() dto: CreateBusinessRoleDto) {
    return this.rolesService.create(dto);
  }
  @Get()
  async findAll(@Query() query: FindRolesDto, @Req() request: Request) {
    return this.rolesService.findAll(query, request);
  }
  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }
  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBusinessRoleDto,
  ) {
    return this.rolesService.update(id, dto);
  }
  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
