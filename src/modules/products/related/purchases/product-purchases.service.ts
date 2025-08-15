import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationService } from "../../../../shared/services/pagination.service";
// import { AuthenticatedUser } from '../../../../shared/interfaces/authenticated-user.interface';
import {
  CreateProductPurchaseDto,
  UpdateProductPurchaseDto,
  FindProductPurchasesDto,
} from "./dto";
import { Prisma } from "@prisma/client";
import { Request } from "express";
interface PurchaseWhereCondition {
  businessId: string;
  deletedAt?: null | undefined;
  productSupplierId?: string;
  purchaseDate?: {
    gte?: Date;
    lte?: Date;
  };
  value?: {
    gte?: number;
    lte?: number;
  };
  paymentMethod?: string;
  description?: {
    contains: string;
    mode: "insensitive";
  };
  items?: {
    some: {
      productId: string;
    };
  };
}
@Injectable()
export class ProductPurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateProductPurchaseDto, user: any) {
    const supplier = await this.prisma.productSupplier.findFirst({
      where: {
        id: dto.productSupplierId,
        businessId: user.businessId,
        deletedAt: null,
      },
    });
    if (!supplier) {
      throw new NotFoundException("Fornecedor não encontrado");
    }
    // const productIds = dto.items.map((item) => item.productId);
    // const products = await this.prisma.product.findMany({
    //   where: {
    //     id: { in: productIds },
    //     businessId: user.businessId,
    //     deletedAt: null,
    //   },
    // });
    // // if (products.length !== productIds.length) {
    // //   throw new BadRequestException(
    // //     'Um or mais produtos não foram encontrados',
    // //   );
    // // }
    // const calculatedTotal = dto.items.reduce(
    //   (sum, item) => sum + item.totalPrice,
    //   0,
    // );
    // // if (Math.abs(dto.value - calculatedTotal) > 0.01) {
    // //   throw new BadRequestException(
    // //     'Valor total da compra não confere com a soma dos itens',
    // //   );
    // // }
    const result = await this.prisma.$transaction(async (tx) => {
      const purchase = await tx.productPurchase.create({
        data: {
          businessId: user.businessId,
          productSupplierId: dto.productSupplierId,
          purchaseDate: new Date(dto.purchaseDate),
          value: dto.value,
          paymentMethod: dto.paymentMethod,
          installmentTotal: dto.installmentTotal,
          createdById: user.id,
          updatedById: user.id,
        },
      });
      // await Promise.all(
      //   dto.items.map((item) =>
      //     tx.productPurchaseItem.create({
      //       data: {
      //         productPurchaseId: purchase.id,
      //         productId: item.productId,
      //         quantity: item.quantity,
      //         unitPrice: item.unitPrice,
      //         totalPrice: item.totalPrice,
      //       },
      //   ),
      // );
      // await Promise.all(
      //   dto.items.map(async (item) => {
      //     const existingStock = await tx.productStock.findFirst({
      //       where: {
      //         productId: item.productId,
      //         businessId: user.businessId,
      //       },
      //     });
      //     if (existingStock) {
      //       await tx.productStock.update({
      //         where: { id: existingStock.id },
      //         data: {
      //           currentStock: existingStock.currentStock + item.quantity,
      //         },
      //       });
      //     } else {
      //       await tx.productStock.create({
      //         data: {
      //           productId: item.productId,
      //           businessId: user.businessId,
      //           currentStock: item.quantity,
      //         },
      //       });
      //     }
      //     await tx.productStockMovement.create({
      //       data: {
      //         productId: item.productId,
      //         quantity: item.quantity,
      //         date: new Date(dto.purchaseDate),
      //         movementType: 'ENTRADA',
      //       },
      //     });
      // );
      return purchase;
    });
    const createdPurchase = await this.prisma.productPurchase.findUnique({
      where: { id: result.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, price: true } },
          },
        },
        supplier: { select: { id: true, name: true } },
      },
    } as any);
    return {
      data: createdPurchase,
      message: "Compra criada com sucesso",
    };
  }
  async findAll(dto: FindProductPurchasesDto, user: any, request: Request) {
    const {
      includeDeleted = false,
      supplierId,
      startDate,
      endDate,
      minValue,
      maxValue,
      paymentMethod,
      productId,
    } = dto;
    const where: Prisma.ProductPurchaseWhereInput = {
      businessId: user.businessId,
    };
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    if (supplierId) {
      where.productSupplierId = supplierId;
    }
    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) {
        where.purchaseDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.purchaseDate.lte = new Date(endDate);
      }
    }
    if (minValue !== undefined || maxValue !== undefined) {
      where.value = {};
      if (minValue !== undefined) {
        where.value.gte = minValue;
      }
      if (maxValue !== undefined) {
        where.value.lte = maxValue;
      }
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }
    if (productId) {
      where.items = {
        some: { productId },
      };
    }
    return this.paginationService.paginate(
      "productPurchase",
      dto,
      {
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, price: true } },
            },
          },
          supplier: { select: { id: true, name: true } },
          business: { select: { id: true, displayName: true } },
        },
        orderBy: { purchaseDate: "desc" },
      },
      ["description"],
      request,
    );
  }
  async findOne(id: string, user: any) {
    const purchase = await this.prisma.productPurchase.findFirst({
      where: {
        id,
        businessId: user.businessId,
        deletedAt: null,
      },
    });
    if (!purchase) {
      throw new NotFoundException("Compra não encontrada");
    }
    return {
      data: purchase,
      message: "Compra encontrada com sucesso",
    };
  }
  async update(id: string, dto: UpdateProductPurchaseDto, user: any) {
    const existingPurchase = await this.prisma.productPurchase.findFirst({
      where: {
        id,
        businessId: user.businessId,
        deletedAt: null,
      },
    });
    if (!existingPurchase) {
      throw new NotFoundException("Compra não encontrada");
    }
    if (
      dto.productSupplierId &&
      dto.productSupplierId !== existingPurchase.productSupplierId
    ) {
      const supplier = await this.prisma.productSupplier.findFirst({
        where: {
          id: dto.productSupplierId,
          businessId: user.businessId,
          deletedAt: null,
        },
      });
      if (!supplier) {
        throw new NotFoundException("Fornecedor não encontrado");
      }
    }
    const updatedPurchase = await this.prisma.productPurchase.update({
      where: { id },
      data: {
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        updatedById: user.id,
        ...(dto.productSupplierId && {
          productSupplierId: dto.productSupplierId,
        }),
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
        ...(dto.installmentTotal !== undefined && {
          installmentTotal: dto.installmentTotal,
        }),
      },
    });
    return {
      data: updatedPurchase,
      message: "Compra atualizada com sucesso",
    };
  }
  async remove(id: string, user: any) {
    const purchase = await this.prisma.productPurchase.findFirst({
      where: {
        id,
        businessId: user.businessId,
        deletedAt: null,
      },
    });
    if (!purchase) {
      throw new NotFoundException("Compra não encontrada");
    }
    await this.prisma.productPurchase.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: user.id,
      },
    });
    return {
      message: "Compra removida com sucesso",
    };
  }
}
