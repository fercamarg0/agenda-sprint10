import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { NotificationTemplatesService } from "./notification-templates.service";
import { CreateNotificationTemplateDto } from "./dto/create-notification-template.dto";
import { UpdateNotificationTemplateDto } from "./dto/update-notification-template.dto";
import { FindNotificationTemplatesDto } from "./dto/find-notification-templates.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../shared/decorator/user.decorator";
import { AuthenticatedUser } from "../../shared/helpers/interfaces/authenticated-user.interface";
@Controller("notification-templates")
@UseGuards(AuthGuard("jwt"))
export class NotificationTemplatesController {
  constructor(
    private readonly notificationTemplatesService: NotificationTemplatesService,
  ) {}
  @Post()
  // summary: 'Criar novo template de notificação',
  // schema: {
  //   properties: {
  //     message: {
  //         'Olá {{customerName}}, seu agendamento está marcado para {{appointmentDate}} às {{appointmentTime}}.',
  //     },
  //   },
  // },
  // status: 400,
  // status: 409,
  create(
    @Body() createNotificationTemplateDto: CreateNotificationTemplateDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.notificationTemplatesService.create(
      createNotificationTemplateDto,
      user,
    );
  }
  @Get()
  // summary: 'Listar templates de notificação',
  // name: 'page',
  // name: 'limit',
  // name: 'type',
  // name: 'title',
  // name: 'message',
  // name: 'variable',
  // name: 'search',
  // name: 'orderBy',
  // name: 'orderDirection',
  findAll(
    @Query() query: FindNotificationTemplatesDto,
    @User() user: AuthenticatedUser,
    @Request() request: Request,
  ) {
    return this.notificationTemplatesService.findAll(query, user, request);
  }
  @Get("stats")
  // summary: 'Obter estatísticas dos templates',
  getStats(@User() user: AuthenticatedUser) {
    return this.notificationTemplatesService.getTemplateStats(user);
  }
  @Get("common-variables")
  // summary: 'Listar variáveis comuns',
  getCommonVariables() {
    return this.notificationTemplatesService.getCommonVariables();
  }
  @Post(":id/render")
  // summary: 'Renderizar template com variáveis',
  // name: 'id',
  // schema: {
  //   properties: {
  //     variables: {
  //         cliente: 'João Silva',
  //         servico: 'Corte de Cabelo',
  //         data: '15/12/2023',
  //         hora: '14:30',
  //       },
  //     },
  //   },
  // },
  // status: 404,
  renderTemplate(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("variables") variables: Record<string, string>,
    @User() user: AuthenticatedUser,
  ) {
    return this.notificationTemplatesService.renderTemplate(
      id,
      variables,
      user,
    );
  }
  @Get(":id")
  // summary: 'Buscar template por ID',
  // name: 'id',
  // status: 404,
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @User() user: AuthenticatedUser,
  ) {
    return this.notificationTemplatesService.findOne(id, user);
  }
  @Patch(":id")
  // summary: 'Atualizar template de notificação',
  // name: 'id',
  // schema: {
  //   properties: {
  //     message: {
  //         'Olá {{customerName}}, confirme seu agendamento para {{appointmentDate}} às {{appointmentTime}}. Responda S para confirmar.',
  //     },
  //   },
  // },
  // status: 404,
  // status: 409,
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateNotificationTemplateDto: UpdateNotificationTemplateDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.notificationTemplatesService.update(
      id,
      updateNotificationTemplateDto,
      user,
    );
  }
  @Delete(":id")
  // summary: 'Excluir template de notificação',
  // name: 'id',
  // status: 404,
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @User() user: AuthenticatedUser,
  ) {
    return this.notificationTemplatesService.remove(id, user);
  }
}
