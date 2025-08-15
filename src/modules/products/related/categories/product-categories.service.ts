import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../../../shared/services/pagination.service";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  FindProductCategoriesDto,
} from "./dto";
import { Prisma } from "@prisma/client";
import { Request } from "express";
@Injectable()
export class ProductCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(
    dto: CreateProductCategoryDto,
    businessId: string,
    userId: string,
  ) {
    const { name } = dto;
    const existingCategory = await this.prisma.productCategory.findFirst({
      where: {
        businessId,
        name,
        deletedAt: null,
      },
    });
    if (existingCategory) {
      throw new BadRequestException("Já existe uma categoria com este nome");
    }
    const category = await this.prisma.productCategory.create({
      data: {
        name,
        businessId,
        createdById: userId,
        updatedById: userId,
      },
    });
    return {
      data: category,
      message: "Categoria criada com sucesso",
    };
  }
  async findAll(
    businessId: string,
    query: FindProductCategoriesDto,
    request: Request,
  ) {
    const { includeDeleted = false } = query;
    const where: Prisma.ProductCategoryWhereInput = {
      businessId,
    };
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    return this.paginationService.paginate(
      "productCategory",
      query,
      {
        where,
        orderBy: { name: "asc" },
      },
      ["name", "description"],
      request,
    );
  }
  async findOne(id: string, businessId: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }
    return {
      data: category,
      message: "Categoria encontrada com sucesso",
    };
  }
  async update(
    id: string,
    dto: UpdateProductCategoryDto,
    businessId: string,
    userId: string,
  ) {
    const existingCategory = await this.prisma.productCategory.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!existingCategory) {
      throw new NotFoundException("Categoria não encontrada");
    }
    if (dto.name && dto.name !== existingCategory.name) {
      const duplicateCategory = await this.prisma.productCategory.findFirst({
        where: {
          businessId,
          name: dto.name,
          deletedAt: null,
          id: { not: id },
        },
      });
      if (duplicateCategory) {
        throw new BadRequestException("Já existe uma categoria com este nome");
      }
    }
    const updatedCategory = await this.prisma.productCategory.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId,
      },
    });
    return {
      data: updatedCategory,
      message: "Categoria atualizada com sucesso",
    };
  }
  async remove(id: string, businessId: string, userId: string) {
    const existingCategory = await this.prisma.productCategory.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!existingCategory) {
      throw new NotFoundException("Categoria não encontrada");
    }
    const deletedCategory = await this.prisma.productCategory.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: userId,
      },
    });
    return {
      data: deletedCategory,
      message: "Categoria removida com sucesso",
    };
  }
}
