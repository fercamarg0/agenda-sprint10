import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { BusinessesService } from "./businesses.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { AuthenticatedUser } from "../../shared/helpers/interfaces/authenticated-user.interface";
import { CurrentUser } from "../../shared/decorator/current-user.decorator";
import { FindBusinessesDto } from "./dto/find-businesses.dto";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { ListBusinessUsersDto } from "./dto/list-business-users.dto";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { OptionalParseUUIDPipe } from "../../shared/pipes/optional-parse-uuid.pipe";
@Controller("businesses")
@UseGuards(AuthGuard)
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}
  @Post()
  //   summary: 'Criar novo negocio',
  create(
    @Body() createBusinessDto: CreateBusinessDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.businessesService.create(createBusinessDto, user);
  }
  @Get()
  //   summary: 'Listar negocios do usuario',
  async findAll(
    @Query() query: FindBusinessesDto,
    @CurrentUser() user: AuthenticatedUser,
    @Request() request: RequestWithUser,
  ) {
    return this.businessesService.findAll(user, query, request);
  }
  @Get(":id/users")
  //   summary: 'Listar usuarios de um negocio',
  async listBusinessUsers(
    @Param("id", OptionalParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListBusinessUsersDto,
    @Request() req: RequestWithUser,
  ) {
    return this.businessesService.listBusinessUsers(id, user, query, req);
  }
  @Get(":id")
  //   summary: 'Buscar negocio por ID',
  async findOne(
    @Param("id", OptionalParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.businessesService.findOne(id, user);
  }
  @Patch(":id")
  //   summary: 'Atualizar dados do negocio',
  async update(
    @Param("id", OptionalParseUUIDPipe) id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.businessesService.update(id, updateBusinessDto, user);
  }
  @Patch(":id/users/:userId/role")
  //   summary: 'Atualizar permissao de usuario no negocio',
  async updateUserRole(
    @Param("id", OptionalParseUUIDPipe) id: string,
    @Param("userId", OptionalParseUUIDPipe) userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.businessesService.updateUserRole(
      id,
      userId,
      updateUserRoleDto.roleId,
      user,
    );
  }
}
