import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../../../shared/services/pagination.service";
import { Request } from "express";
import {
  CreateServicePackageDto,
  UpdateServicePackageDto,
  FindServicePackagesDto,
} from "./dto";
@Injectable()
export class ServicePackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateServicePackageDto, businessId: string) {
    const services = await this.prisma.service.findMany({
      where: {
        id: { in: dto.items.map((item) => item.serviceId) },
        businessId,
        deletedAt: null,
      },
    });
    if (services.length !== dto.items.length) {
      throw new BadRequestException(
        "One or more services are invalid or do not belong to this business",
      );
    }
    const servicePackage = await this.prisma.servicePackage.create({
      data: {
        businessId,
        name: dto.name,
        price: dto.price,
        items: {
          create: dto.items.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                duration: true,
              },
            },
          },
        },
      },
    });
    return {
      data: servicePackage,
      message: "Service package created successfully",
    };
  }
  async findAll(
    businessId: string,
    query: FindServicePackagesDto,
    req: Request,
  ) {
    const where: any = {
      businessId,
      deletedAt: null,
    };
    if (typeof query.active === "boolean") {
      where.isActive = query.active;
    }
    return this.paginationService.paginate(
      "servicePackage",
      query,
      {
        where,
        include: {
          items: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  duration: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      ["name", "description"],
      req,
    );
  }
  async findOne(id: string, businessId: string) {
    const servicePackage = await this.prisma.servicePackage.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                duration: true,
              },
            },
          },
        },
      },
    });
    if (!servicePackage) {
      throw new NotFoundException("Service package not found");
    }
    return {
      data: servicePackage,
      message: "Service package retrieved successfully",
    };
  }
  async update(id: string, dto: UpdateServicePackageDto, businessId: string) {
    const existingPackage = await this.prisma.servicePackage.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!existingPackage) {
      throw new NotFoundException("Service package not found");
    }
    if (dto.items) {
      const services = await this.prisma.service.findMany({
        where: {
          id: { in: dto.items.map((item) => item.serviceId) },
          businessId,
          deletedAt: null,
        },
      });
      if (services.length !== dto.items.length) {
        throw new BadRequestException(
          "One or more services are invalid or do not belong to this business",
        );
      }
    }
    const updateData = {
      ...(dto.name && { name: dto.name }),
      ...(dto.price && { price: dto.price }),
    };
    const servicePackage = await this.prisma.servicePackage.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                duration: true,
              },
            },
          },
        },
      },
    });
    if (dto.items) {
      await this.prisma.servicePackageItem.deleteMany({
        where: { servicePackageId: id },
      });
      await this.prisma.servicePackageItem.createMany({
        data: dto.items.map((item) => ({
          servicePackageId: id,
          serviceId: item.serviceId,
          quantity: item.quantity,
        })),
      });
    }
    return {
      data: servicePackage,
      message: "Service package updated successfully",
    };
  }
  async remove(id: string, businessId: string) {
    const servicePackage = await this.prisma.servicePackage.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!servicePackage) {
      throw new NotFoundException("Service package not found");
    }
    await this.prisma.servicePackage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      message: "Service package deleted successfully",
    };
  }
}
