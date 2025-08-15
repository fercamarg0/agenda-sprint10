import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../shared/services/pagination.service";
import { CreateProductDto, UpdateProductDto, FindProductsDto } from "./dto";
import { Prisma } from "@prisma/client";
import { Request } from "express";
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  private async getUserBusinessId(
    userId: string,
    businessId: string,
  ): Promise<string> {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: { userId, businessId },
      select: { id: true },
    });
    if (!userBusiness) {
      throw new NotFoundException(
        "The user is not associated with this business.",
      );
    }
    return userBusiness.id;
  }
  async create(dto: CreateProductDto, businessId: string, userId: string) {
    const { productCategoryId, name } = dto;
    const userBusinessId = await this.getUserBusinessId(userId, businessId);
    const category = await this.prisma.productCategory.findFirst({
      where: {
        id: productCategoryId,
        businessId,
        deletedAt: null,
      },
    });
    if (!category) {
      throw new BadRequestException("Categoria não encontrada");
    }
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        businessId,
        name,
        productCategoryId,
        deletedAt: null,
      },
    });
    if (existingProduct) {
      throw new BadRequestException(
        "Já existe um produto com este nome nesta categoria",
      );
    }
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        businessId,
        createdById: userBusinessId,
        updatedById: userBusinessId,
      },
      include: {
        business: true,
      },
    });
    return {
      data: product,
      message: "Produto criado com sucesso",
    };
  }
  async findAll(businessId: string, query: FindProductsDto, request: Request) {
    const {
      name,
      categoryId,
      activeOnly = true,
      lowStock = false,
      outOfStock = false,
      minPrice,
      maxPrice,
      includeDeleted = false,
      sortBy = "name",
      sortOrder = "asc",
    } = query;
    const where: Prisma.ProductWhereInput = {
      businessId,
    };
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    if (activeOnly) {
      where.active = true;
    }
    if (categoryId) {
      where.productCategoryId = categoryId;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {};
      if (minPrice !== undefined) {
        where.salePrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.salePrice.lte = maxPrice;
      }
    }
    if (lowStock) {
      where.stock = { gte: 0 };
    }
    if (outOfStock) {
      where.stock = { equals: 0 };
    }
    let orderBy: any = { name: "asc" };
    if (sortBy && sortOrder) {
      orderBy = { [sortBy]: sortOrder };
    }
    return this.paginationService.paginate(
      "product",
      query,
      {
        where,
        include: {
          business: {
            select: {
              id: true,
              displayName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy,
      },
      ["name", "description"],
      request,
    );
  }
  async findOne(id: string, businessId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
      include: {
        business: {
          select: {
            id: true,
            displayName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }
    return {
      data: product,
      message: "Produto encontrado com sucesso",
    };
  }
  async update(
    id: string,
    dto: UpdateProductDto,
    businessId: string,
    userId: string,
  ) {
    const userBusinessId = await this.getUserBusinessId(userId, businessId);
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!existingProduct) {
      throw new NotFoundException("Produto não encontrado");
    }
    if (
      dto.productCategoryId &&
      dto.productCategoryId !== existingProduct.productCategoryId
    ) {
      const category = await this.prisma.productCategory.findFirst({
        where: {
          id: dto.productCategoryId,
          businessId,
          deletedAt: null,
        },
      });
      if (!category) {
        throw new BadRequestException("Categoria não encontrada");
      }
    }
    if (dto.name && dto.name !== existingProduct.name) {
      const categoryId =
        dto.productCategoryId ?? existingProduct.productCategoryId;
      const duplicateProduct = await this.prisma.product.findFirst({
        where: {
          businessId,
          name: dto.name,
          productCategoryId: categoryId,
          deletedAt: null,
          id: { not: id },
        },
      });
      if (duplicateProduct) {
        throw new BadRequestException(
          "Já existe um produto com este nome nesta categoria",
        );
      }
    }
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userBusinessId,
      },
      include: {
        business: {
          select: {
            id: true,
            displayName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return {
      data: updatedProduct,
      message: "Produto atualizado com sucesso",
    };
  }
  async remove(id: string, businessId: string, userId: string) {
    const userBusinessId = await this.getUserBusinessId(userId, businessId);
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!existingProduct) {
      throw new NotFoundException("Produto não encontrado");
    }
    const deletedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: userBusinessId,
      },
    });
    return {
      data: deletedProduct,
      message: "Produto removido com sucesso",
    };
  }
  private async getLowStockCount(businessId: string): Promise<number> {
    return this.prisma.product.count({
      where: {
        businessId,
        deletedAt: null,
        active: true,
      },
    });
  }
  private async getOutOfStockCount(businessId: string): Promise<number> {
    return this.prisma.product.count({
      where: {
        businessId,
        deletedAt: null,
        active: true,
        stock: 0,
      },
    });
  }
  async adjustStock(
    id: string,
    quantity: number,
    businessId: string,
    userId: string,
    reason = "Ajuste manual",
  ) {
    const userBusinessId = await this.getUserBusinessId(userId, businessId);
    const product = await this.findOne(id, businessId);
    const newStock = Math.max(0, product.data.stock + quantity);
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        stock: newStock,
        updatedById: userBusinessId,
      },
    });
    return {
      data: updatedProduct,
      message: `Estoque ajustado com sucesso. Quantidade alterada: ${quantity}`,
    };
  }
}
