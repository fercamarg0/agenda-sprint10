import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthenticatedUser } from "../../shared/interfaces/authenticated-user.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../shared/services/pagination.service";
import { FindServicesDto } from "./dto/find-services.dto";
import { Request } from "express";
import { Service } from "@prisma/client";
@Injectable()
export class ServicesService {
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
      throw new ForbiddenException(
        "Authenticated user is not a member of this business.",
      );
    }
    return userBusiness.id;
  }
  async create(dto: CreateServiceDto, user: AuthenticatedUser) {
    const userBusinessId = await this.getUserBusinessId(
      user.id,
      user.businessId,
    );
    const service = await this.prisma.service.create({
      data: {
        ...dto,
        businessId: user.businessId,
        createdById: userBusinessId,
        updatedById: userBusinessId,
      },
    });
    return {
      data: service,
      message: this.i18n.translate("services.create.success"),
    };
  }
  async findAll(
    user: AuthenticatedUser,
    query: FindServicesDto,
    request: Request,
  ) {
    const where: any = {
      businessId: user.businessId,
      deletedAt: null,
    };
    if (query.name) {
      where.name = { contains: query.name, mode: "insensitive" };
    }
    if (typeof query.isActive === "boolean") {
      where.isActive = query.isActive;
    }
    return this.paginationService.paginate<Service>(
      "service",
      query,
      {
        where,
      },
      ["name", "description"],
      request,
    );
  }
  async findOne(id: string, user: AuthenticatedUser) {
    const service = await this.prisma.service.findFirst({
      where: { id, businessId: user.businessId, deletedAt: null },
    });
    if (!service) {
      throw new NotFoundException(
        this.i18n.translate("errors.services.not_found"),
      );
    }
    return {
      data: service,
      message: this.i18n.translate("services.find_one.success"),
    };
  }
  async update(id: string, dto: UpdateServiceDto, user: AuthenticatedUser) {
    await this.findOne(id, user);
    const userBusinessId = await this.getUserBusinessId(
      user.id,
      user.businessId,
    );
    const updatedService = await this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userBusinessId,
      },
    });
    return {
      data: updatedService,
      message: this.i18n.translate("services.update.success"),
    };
  }
  async remove(id: string, user: AuthenticatedUser) {
    await this.findOne(id, user);
    const userBusinessId = await this.getUserBusinessId(
      user.id,
      user.businessId,
    );
    await this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: userBusinessId },
    });
    return {
      message: this.i18n.translate("services.remove.success"),
    };
  }
}
