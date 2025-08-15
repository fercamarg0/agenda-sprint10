import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationService } from "../../../../shared/services/pagination.service";
// import { AuthenticatedUser } from '../../../../shared/interfaces/authenticated-user.interface';
import { CreateProductStockMovementDto } from "./dto/create-product-stock-movement.dto";
import { UpdateProductStockMovementDto } from "./dto/update-product-stock-movement.dto";
import { FindProductStockMovementsDto } from "./dto/find-product-stock-movements.dto";
import { Prisma } from "@prisma/client";
import { Request } from "express";
@Injectable()
export class ProductStockMovementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateStockMovementDto, user: any) {
    const { productId, quantity, movementType, description } = createDto;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stock: true },
    });
    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }
    if (movementType === "SAIDA" && product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${product.stock}, Solicitado: ${quantity}`,
      );
    }
    return await this.prisma.$transaction(async (tx) => {
      let quantityChange = 0;
      switch (movementType) {
        case "ENTRADA":
          quantityChange = quantity;
          break;
        case "SAIDA":
          quantityChange = -quantity;
          break;
        case "AJUSTE":
          quantityChange = quantity;
          break;
        default:
          throw new BadRequestException("Tipo de movimentação inválido");
      }
      await tx.product.update({
        where: { id: productId },
        data: { stock: { increment: quantityChange } },
      });
      const stockMovement = await tx.productStockMovement.create({
        data: {
          productId,
          quantity,
          movementType,
          date: new Date(),
        },
      });
      return {
        data: stockMovement,
        message: "Movimentação de estoque criada com sucesso",
      };
    });
  }
  async findAll(
    findDto: FindProductStockMovementsDto,
    _user: AuthenticatedUser,
    request: Request,
  ) {
    const { productId, movementType, startDate, endDate, search } = findDto;
    const where: Prisma.ProductStockMovementWhereInput = {};
    if (productId) where.productId = productId;
    if (movementType) where.movementType = movementType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (search) {
      where.description = {
        contains: search,
        mode: "insensitive",
      };
    }
    return this.paginationService.paginate(
      "productStockMovement",
      findDto,
      {
        where,
        include: {
          product: { select: { id: true, name: true } },
        },
        orderBy: { date: "desc" },
      },
      ["description"],
      request,
    );
  }
  async findOne(id: string, user: any) {
    const movement = await this.prisma.productStockMovement.findUnique({
      where: { id },
    });
    if (!movement) {
      throw new NotFoundException("Movimentação não encontrada");
    }
    return {
      data: movement,
      message: "Movimentação encontrada com sucesso",
    };
  }
  async update(id: string, dto: UpdateStockMovementDto, user: any) {
    const existingMovement = await this.prisma.productStockMovement.findUnique({
      where: { id },
    });
    if (!existingMovement) {
      throw new NotFoundException("Movimentação não encontrada");
    }
    const updatedMovement = await this.prisma.productStockMovement.update({
      where: { id },
      data: {},
    });
    return {
      data: updatedMovement,
      message: "Movimentação atualizada com sucesso",
    };
  }
  async remove(id: string, user: any) {
    throw new BadRequestException(
      "Não é possível deletar movimentações de estoque. Para corrigir, crie uma nova movimentação de ajuste.",
    );
  }
  async getStockSummary(productId: string, _user: AuthenticatedUser) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stock: true },
    });
    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }
    const movementsByType = await this.prisma.productStockMovement.groupBy({
      by: ["movementType"],
      where: { productId },
      _sum: { quantity: true },
      _count: { id: true },
    });
    const summary = {
      entries: { total: 0, count: 0 },
      exits: { total: 0, count: 0 },
      adjustments: { total: 0, count: 0 },
    };
    movementsByType.forEach((movement) => {
      const quantity = movement._sum.quantity ?? 0;
      const count = movement._count.id ?? 0;
      switch (movement.movementType) {
        case "ENTRADA":
          summary.entries = { total: quantity, count };
          break;
        case "SAIDA":
          summary.exits = { total: quantity, count };
          break;
        case "AJUSTE":
          summary.adjustments = { total: quantity, count };
          break;
      }
    });
    const totalMovements = movementsByType.reduce(
      (acc, movement) => acc + (movement._count.id ?? 0),
      0,
    );
    return {
      data: {
        product: {
          id: product.id,
          name: product.name,
          currentStock: product.stock,
        },
        summary,
        totalMovements,
      },
      message: "Resumo de estoque obtido com sucesso",
    };
  }
}
