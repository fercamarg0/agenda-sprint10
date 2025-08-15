import { Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../../../prisma/prisma.service";
import { AuthenticatedUser } from "../../../../shared/interfaces/authenticated-user.interface";
import { PaginationService } from "../../../../shared/services/pagination.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { FindServiceCategoriesDto } from "./dto/find-service-categories.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, user: AuthenticatedUser) {
    return this.prisma.serviceCategory.create({
      data: {
        ...createCategoryDto,
        businessId: user.businessId,
        createdById: user.id,
        updatedById: user.id,
      },
    });
  }
  async findAll(
    user: AuthenticatedUser,
    query: FindServiceCategoriesDto,
    req: Request,
  ) {
    const where: any = {
      businessId: user.businessId,
      deletedAt: null,
    };
    if (query.name) {
      where.name = {
        contains: query.name,
        mode: "insensitive",
      };
    }
    return this.paginationService.paginate(
      "serviceCategory",
      query,
      {
        where,
        orderBy: {
          name: "asc",
        },
      },
      ["name", "description"],
      req,
    );
  }
  async findOne(id: string, user: AuthenticatedUser) {
    const category = await this.prisma.serviceCategory.findFirst({
      where: {
        id,
        businessId: user.businessId,
        deletedAt: null,
      },
    });
    if (!category) {
      throw new NotFoundException("Service category not found.");
    }
    return category;
  }
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: AuthenticatedUser,
  ) {
    await this.findOne(id, user);
    return this.prisma.serviceCategory.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        updatedById: user.id,
      },
    });
  }
  async remove(id: string, user: AuthenticatedUser) {
    await this.findOne(id, user);
    return this.prisma.serviceCategory.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: user.id,
      },
    });
  }
}
