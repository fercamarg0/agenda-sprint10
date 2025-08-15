import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBusinessRoleDto } from "./dto/create-business-role.dto";
import { UpdateBusinessRoleDto } from "./dto/update-business-role.dto";
import { FindRolesDto } from "./dto/find-roles.dto";
import { I18nService } from "nestjs-i18n";
import { Prisma } from "@prisma/client";
import { PaginationService } from "../../shared/services/pagination.service";
import { Request } from "express";
@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createRoleDto: CreateBusinessRoleDto) {
    const role = await this.prisma.businessRole.create({
      data: {
        name: createRoleDto.value,
        permissions: createRoleDto.permissions,
        active: true,
      },
    });
    return role;
  }
  async findAll(query: FindRolesDto, request: Request) {
    const where: Prisma.BusinessRoleWhereInput = {
      deletedAt: null,
    };
    if (query.active !== undefined) {
      where.active = query.active;
    }
    const orderBy: Prisma.BusinessRoleOrderByWithRelationInput[] = [
      { name: "asc" },
      { createdAt: "desc" },
    ];
    const searchableFields = ["name", "description"];
    return this.paginationService.paginate(
      "businessRole",
      query,
      {
        where,
        orderBy,
        include: {},
      },
      searchableFields,
      request,
    );
  }
  async findOne(id: string) {
    const role = await this.prisma.businessRole.findUnique({
      where: { id, deletedAt: null },
    });
    if (!role) {
      throw new NotFoundException(this.i18n.translate("errors.role.not_found"));
    }
    return role;
  }
  async update(id: string, dto: UpdateBusinessRoleDto) {
    const role = await this.prisma.businessRole.findUnique({
      where: { id, deletedAt: null },
    });
    if (!role) {
      throw new NotFoundException(this.i18n.translate("errors.role.not_found"));
    }
    const dataToUpdate: Prisma.BusinessRoleUpdateInput = {
      updatedAt: new Date(),
    };
    if (dto.value !== undefined) {
      dataToUpdate.name = dto.value;
    }
    if (dto.name !== undefined) {
      dataToUpdate.description = dto.name;
    }
    if (dto.permissions !== undefined) {
      dataToUpdate.permissions = dto.permissions;
    }
    const updatedRole = await this.prisma.businessRole.update({
      where: { id },
      data: dataToUpdate,
    });
    return updatedRole;
  }
  async remove(id: string) {
    const role = await this.prisma.businessRole.findUnique({
      where: { id, deletedAt: null },
    });
    if (!role) {
      throw new NotFoundException(this.i18n.translate("errors.role.not_found"));
    }
    await this.prisma.businessRole.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: this.i18n.translate("messages.role.deleted") };
  }
}
