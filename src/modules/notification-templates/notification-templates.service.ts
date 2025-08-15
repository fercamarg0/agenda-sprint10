import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../shared/services/pagination.service";
import { CreateNotificationTemplateDto } from "./dto/create-notification-template.dto";
import { UpdateNotificationTemplateDto } from "./dto/update-notification-template.dto";
import { FindNotificationTemplatesDto } from "./dto/find-notification-templates.dto";
// import { AuthenticatedUser } from "../../shared/interfaces/authenticated-user.interface";
import { Request } from "express";
@Injectable()
export class NotificationTemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  private extractVariablesFromMessage(message: string): string[] {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;
    while ((match = variableRegex.exec(message)) !== null) {
      const variable = match[1].trim();
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }
    return variables;
  }
  async create(
    dto: CreateNotificationTemplateDto,
    user: any,
  ): Promise<{ data: any; message: string }> {
    const business = await this.prisma.business.findFirst({
      where: {
        id: user.businessId,
        deletedAt: null,
      },
    });
    if (!business) {
      throw new NotFoundException("Negócio não encontrado");
    }
    const existingTemplate = await this.prisma.notificationTemplate.findFirst({
      where: {
        businessId: user.businessId,
        title: dto.title,
      },
    });
    if (existingTemplate) {
      throw new ConflictException("Já existe um template com este título");
    }
    const extractedVariables = this.extractVariablesFromMessage(dto.message);
    // const notificationTemplate = await this.prisma.notificationTemplate.create({
    //   data: {
    //     businessId: user.businessId,
    //     title: dto.title.trim(),
    //     message: dto.message.trim(),
    //     variables: extractedVariables,
    //   },
    // });
    return {
      data: {},
      message: "Template de notificação criado com sucesso.",
    };
  }
  async findAll(
    dto: FindNotificationTemplatesDto,
    user: any,
    request?: any,
  ): Promise<any> {
    const whereCondition: any = {
      businessId: user.businessId,
    };
    if (dto.type) {
      whereCondition.type = dto.type;
    }
    if (dto.search) {
      whereCondition.OR = [
        { title: { contains: dto.search, mode: "insensitive" } },
        { message: { contains: dto.search, mode: "insensitive" } },
      ];
    }
    if (dto.variable) {
      whereCondition.variables = { has: dto.variable };
    }
    const searchableFields = ["title", "message"];
    return this.paginationService.paginate(
      "notificationTemplate",
      dto,
      {
        where: whereCondition,
        orderBy: {
          [dto.orderBy ?? "createdAt"]: dto.orderDirection ?? "desc",
        },
      },
      searchableFields,
      request,
    );
  }
  async findOne(
    id: string,
    user: any,
  ): Promise<{ data: any; message: string }> {
    const notificationTemplate =
      await this.prisma.notificationTemplate.findFirst({
        where: {
          id,
          businessId: user.businessId,
        },
      });
    if (!notificationTemplate) {
      throw new NotFoundException("Template de notificação não encontrado.");
    }
    return {
      data: notificationTemplate,
      message: "Template de notificação encontrado com sucesso.",
    };
  }
  async update(
    id: string,
    dto: UpdateNotificationTemplateDto,
    user: any,
  ): Promise<{ data: any; message: string }> {
    const existingTemplate = await this.prisma.notificationTemplate.findFirst({
      where: {
        id,
        businessId: user.businessId,
      },
    });
    if (!existingTemplate) {
      throw new NotFoundException("Template de notificação não encontrado.");
    }
    if (dto.title && dto.title !== existingTemplate.title) {
      const duplicateTemplate =
        await this.prisma.notificationTemplate.findFirst({
          where: {
            businessId: user.businessId,
            title: dto.title,
            id: { not: id },
          },
        });
      if (duplicateTemplate) {
        throw new ConflictException("Já existe um template com este título");
      }
    }
    const updateData: any = { ...dto };
    if (dto.message) {
      updateData.variables = this.extractVariablesFromMessage(dto.message);
    }
    const updatedTemplate = await this.prisma.notificationTemplate.update({
      where: { id },
      data: updateData,
    });
    return {
      data: updatedTemplate,
      message: "Template de notificação atualizado com sucesso.",
    };
  }
  async remove(id: string, user: any): Promise<{ message: string }> {
    const existingTemplate = await this.prisma.notificationTemplate.findFirst({
      where: {
        id,
        businessId: user.businessId,
      },
    });
    if (!existingTemplate) {
      throw new NotFoundException("Template de notificação não encontrado.");
    }
    await this.prisma.notificationTemplate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      message: "Template de notificação removido com sucesso.",
    };
  }
  async renderTemplate(
    id: string,
    variables: Record<string, string>,
    user: any,
  ): Promise<{ data: any; message: string }> {
    const templateResult = await this.findOne(id, user);
    const template = templateResult.data;
    let renderedMessage = template.message;
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      renderedMessage = renderedMessage.replace(
        new RegExp(placeholder, "g"),
        value,
      );
    });
    const unreplacedVariables =
      this.extractVariablesFromMessage(renderedMessage);
    const result = {
      ...template,
      renderedMessage,
      providedVariables: variables,
      unreplacedVariables,
      isFullyRendered: unreplacedVariables.length === 0,
    };
    return {
      data: result,
      message: "Template renderizado com sucesso.",
    };
  }
  async getTemplateStats(user: any): Promise<{ data: any; message: string }> {
    const [totalTemplates, templatesByType] = await Promise.all([
      this.prisma.notificationTemplate.count({
        where: {
          businessId: user.businessId,
        },
      }),
      this.prisma.notificationTemplate.groupBy({
        by: ["type"],
        where: {
          businessId: user.businessId,
        },
        _count: {
          _all: true,
        },
      }),
    ]);
    const stats = {
      totalTemplates,
      byType: templatesByType.reduce((acc: any, item) => {
        if (item._count) {
          acc[item.type] = item._count._all;
        }
        return acc;
      }, {}),
    };
    return {
      data: stats,
      message: "Estatísticas dos templates obtidas com sucesso.",
    };
  }
  getCommonVariables(): { data: string[]; message: string } {
    const commonVariables = [
      "cliente",
      "servico",
      "data",
      "hora",
      "profissional",
      "valor",
      "endereco",
      "telefone",
      "observacoes",
      "empresa",
      "website",
      "email_empresa",
    ];
    return {
      data: commonVariables,
      message: "Variáveis comuns listadas com sucesso.",
    };
  }
}
