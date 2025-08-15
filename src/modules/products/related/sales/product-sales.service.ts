import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../../../shared/services/pagination.service";
// import { AuthenticatedUser } from '../../../../shared/interfaces/authenticated-user.interface';
import {
  CreateProductSaleDto,
  UpdateProductSaleDto,
  FindProductSalesDto,
} from "./dto";
import { Prisma } from "@prisma/client";
import { Request } from "express";
@Injectable()
export class ProductSalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateProductSaleDto, businessId: string, userId: string) {
    if (!dto.customerId) {
      throw new BadRequestException("Customer ID is required");
    }
    const customer = await this.prisma.customer.findFirst({
      where: { id: dto.customerId, businessId },
    });
    if (!customer) {
      throw new BadRequestException("Customer not found");
    }
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: dto.items.map((item) => item.productId) },
        businessId,
      },
    });
    if (products.length !== dto.items.length) {
      throw new BadRequestException("Invalid products");
    }
    const productSale = await this.prisma.productSale.create({
      data: {
        businessId,
        customerId: dto.customerId,
        saleDate: new Date(),
        discount: dto.discount ?? 0,
        discountInPercentage: false,
        comments: dto.notes,
        createdById: userId,
        updatedById: userId,
      },
    });
    await this.prisma.productSaleItem.createMany({
      data: dto.items.map((item) => ({
        productSaleId: productSale.id,
        productId: item.productId,
        quantity: item.quantity,
        value: item.unitPrice,
      })),
    });
    return {
      data: productSale,
      message: "Product sale created successfully",
    };
  }
  async findAll(
    businessId: string,
    query: FindProductSalesDto,
    request: Request,
  ) {
    const { customerId } = query;
    const where: Prisma.ProductSaleWhereInput = {
      businessId,
    };
    if (customerId) {
      where.customerId = customerId;
    }
    return this.paginationService.paginate(
      "productSale",
      query,
      {
        where,
        include: {
          customer: {
            select: { id: true, name: true },
          },
          items: {
            include: {
              product: { select: { id: true, name: true, price: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      ["comments"],
      request,
    );
  }
  async findOne(id: string, businessId: string) {
    const productSale = await this.prisma.productSale.findFirst({
      where: { id, businessId },
    });
    if (!productSale) {
      throw new NotFoundException("Product sale not found");
    }
    return {
      data: productSale,
      message: "Product sale retrieved successfully",
    };
  }
  async update(
    id: string,
    dto: UpdateProductSaleDto,
    businessId: string,
    userId: string,
  ) {
    const existingSale = await this.prisma.productSale.findFirst({
      where: { id, businessId },
    });
    if (!existingSale) {
      throw new NotFoundException("Product sale not found");
    }
    const updatedSale = await this.prisma.productSale.update({
      where: { id },
      data: {
        comments: dto.notes,
        discount: dto.discount ?? existingSale.discount,
        updatedById: userId,
      },
    });
    return {
      data: updatedSale,
      message: "Product sale updated successfully",
    };
  }
  async remove(id: string, businessId: string) {
    const productSale = await this.prisma.productSale.findFirst({
      where: { id, businessId },
    });
    if (!productSale) {
      throw new NotFoundException("Product sale not found");
    }
    await this.prisma.productSale.delete({
      where: { id },
    });
    return {
      message: "Product sale deleted successfully",
    };
  }
}
