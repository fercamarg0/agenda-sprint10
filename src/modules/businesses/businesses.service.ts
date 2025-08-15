import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { FindBusinessesDto } from "./dto/find-businesses.dto";
import { AuthenticatedUser } from "../../shared/helpers/interfaces/authenticated-user.interface";
import {
  Business,
  EntityType,
  Prisma,
  User,
  UserBusinessStatus,
} from "@prisma/client";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../../prisma/prisma.service";
import { PaginationService } from "../../shared/services/pagination.service";
import { ListBusinessUsersDto } from "./dto/list-business-users.dto";
import { Request } from "express";
import { EnumValidator } from "../../shared/helpers/enum.helper";
@Injectable()
export class BusinessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(
    createBusinessDto: CreateBusinessDto,
    user: AuthenticatedUser,
  ): Promise<{ data: Business; message: string }> {
    const { entityType, cpf, cnpj } = createBusinessDto;
    const existingBusiness = await this.prisma.business.findFirst({
      where: {
        OR: [
          ...(entityType === EntityType.PERSON && cpf ? [{ cpf }] : []),
          ...(entityType === EntityType.CORPORATION && cnpj ? [{ cnpj }] : []),
        ],
        deletedAt: null,
      },
    });
    if (existingBusiness) {
      const message = this.i18n.translate("errors.business.already_exists");
      throw new ConflictException(message);
    }
    const business = await this.prisma.$transaction(async (tx) => {
      const newBusiness = await tx.business.create({
        data: {
          displayName: createBusinessDto.name,
          email: createBusinessDto.email,
          phone: createBusinessDto.phone,
          entityType: createBusinessDto.entityType,
          cpf: createBusinessDto.cpf,
          cnpj: createBusinessDto.cnpj,
          description: createBusinessDto.description,
          address: {
            create: {
              street: createBusinessDto.address,
              number: createBusinessDto.number ?? "",
              complement: createBusinessDto.complement,
              neighborhood: createBusinessDto.neighborhood ?? "",
              city: createBusinessDto.city,
              state: createBusinessDto.state,
              zipCode: createBusinessDto.zipCode,
              country: "Brasil",
            },
          },
        },
      });
      const ownerRole = await tx.businessRole.findFirst({
        where: { name: "OWNER" },
      });
      if (!ownerRole) {
        throw new Error('Default role "owner" not found.');
      }
      await tx.userBusiness.create({
        data: {
          userId: user.id,
          businessId: newBusiness.id,
          businessRoleId: ownerRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
      await tx.userPreferences.upsert({
        where: { userId: user.id },
        update: {
          defaultBusinessId: newBusiness.id,
        },
        create: {
          userId: user.id,
          defaultBusinessId: newBusiness.id,
        },
      });
      return newBusiness;
    });
    const message =
      this.i18n.translate("businesses.create.success") ||
      "Negócio criado com sucesso";
    return {
      data: business,
      message,
    };
  }
  async findAll(
    user: AuthenticatedUser,
    query: FindBusinessesDto,
    request: Request,
  ) {
    let userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId: user.id },
    });
    if (!userPreferences?.defaultBusinessId) {
      const userBusinesses = await this.prisma.business.findMany({
        where: {
          userBusinesses: {
            some: { userId: user.id, status: UserBusinessStatus.ACCEPTED },
          },
          deletedAt: null,
        },
        include: {
          userBusinesses: {
            where: { userId: user.id },
            include: { role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      if (userBusinesses.length > 0) {
        const ownerBusiness = userBusinesses.find((b) =>
          b.userBusinesses.some((ub) => ub.role.name === "OWNER"),
        );
        const defaultBusinessId = ownerBusiness?.id || userBusinesses[0].id;
        userPreferences = await this.prisma.userPreferences.upsert({
          where: { userId: user.id },
          update: { defaultBusinessId },
          create: { userId: user.id, defaultBusinessId },
        });
      }
    }
    const where: Prisma.BusinessWhereInput = {
      userBusinesses: {
        some: {
          userId: user.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      },
      deletedAt: null,
    };
    if (query.entityType) {
      where.entityType = query.entityType;
    }
    const orderBy: Prisma.BusinessOrderByWithRelationInput[] = [
      { displayName: "asc" },
      { createdAt: "desc" },
    ];
    const include: Prisma.BusinessInclude = {
      address: true,
      userBusinesses: {
        where: { userId: user.id },
        include: { role: true },
      },
    };
    const searchableFields = ["displayName", "email"];
    const result = await this.paginationService.paginate(
      "business",
      query,
      {
        where,
        orderBy,
        include,
      },
      searchableFields,
      request,
    );
    const transformedData = result.data.map((business: any) => {
      const { userBusinesses, ...rest } = business;
      const myRole = userBusinesses.length > 0 ? userBusinesses[0].role : null;
      const userBusinessStatus =
        userBusinesses.length > 0 ? userBusinesses[0].status : null;
      return {
        ...rest,
        role: myRole?.name ?? null,
        status: userBusinessStatus,
        isDefault: business.id === userPreferences?.defaultBusinessId,
        isCurrent: business.id === user.businessId,
        canAccess: EnumValidator.canUserAccessBusiness(userBusinessStatus),
      };
    });
    return {
      ...result,
      data: transformedData,
    };
  }
  async findOne(id: string, user: AuthenticatedUser) {
    const business = await this.prisma.business.findFirst({
      where: {
        id,
        deletedAt: null,
        userBusinesses: { some: { userId: user.id } },
      },
      include: { address: true },
    });
    if (!business) {
      const message = this.i18n.translate("errors.business.not_found");
      throw new NotFoundException(message);
    }
    return business;
  }
  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
    user: AuthenticatedUser,
  ) {
    await this.findOne(id, user);
    const {
      address,
      city,
      state,
      zipCode,
      number,
      complement,
      neighborhood,
      ...businessData
    } = updateBusinessDto;
    const updatedBusiness = await this.prisma.business.update({
      where: { id },
      data: {
        ...businessData,
        address: {
          update: {
            street: address,
            number,
            complement,
            neighborhood,
            city,
            state,
            zipCode,
          },
        },
      },
      include: { address: true },
    });
    const message = this.i18n.translate("businesses.update.success");
    return {
      data: updatedBusiness,
      message,
    };
  }
  async remove(id: string, user: AuthenticatedUser) {
    await this.findOne(id, user);
    await this.prisma.business.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    const message = this.i18n.translate("businesses.remove.success");
    return {
      message,
    };
  }
  async listBusinessUsers(
    businessId: string,
    user: AuthenticatedUser,
    query: ListBusinessUsersDto,
    request: Request,
  ) {
    await this.findOne(businessId, user);
    const where: Prisma.UserWhereInput = {
      userBusinesses: {
        some: { businessId },
      },
    };
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        {
          profile: {
            fullName: { contains: query.search, mode: "insensitive" },
          },
        },
      ];
    }
    return this.paginationService.paginate<User>(
      "user",
      query,
      {
        where,
        include: {
          profile: true,
          userBusinesses: {
            where: { businessId },
            include: {
              role: true,
            },
          },
        },
      },
      [],
      request,
    );
  }
  async listBusinessRoles() {
    return this.prisma.businessRole.findMany();
  }
  async updateUserRole(
    businessId: string,
    userIdToUpdate: string,
    roleId: string,
    authenticatedUser: AuthenticatedUser,
  ) {
    await this.findOne(businessId, authenticatedUser);
    const userBusinessToUpdate = await this.prisma.userBusiness.findUnique({
      where: {
        userId_businessId: {
          userId: userIdToUpdate,
          businessId: businessId,
        },
      },
      include: {
        role: true,
      },
    });
    if (!userBusinessToUpdate) {
      const message = this.i18n.translate("errors.user.not_found_in_business");
      throw new NotFoundException(message);
    }
    const newRole = await this.prisma.businessRole.findUnique({
      where: { id: roleId },
    });
    if (!newRole) {
      const message = this.i18n.translate("errors.role.not_found");
      throw new NotFoundException(message);
    }
    if (userIdToUpdate === authenticatedUser.id) {
      const message = this.i18n.translate("errors.user.cannot_change_own_role");
      throw new ForbiddenException(message);
    }
    if (userBusinessToUpdate.role.name === "OWNER") {
      const ownerCount = await this.prisma.userBusiness.count({
        where: {
          businessId: businessId,
          role: {
            name: "OWNER",
          },
        },
      });
      if (ownerCount <= 1) {
        const message = this.i18n.translate(
          "errors.business.cannot_remove_last_owner",
        );
        throw new ForbiddenException(message);
      }
    }
    const updatedUserBusiness = await this.prisma.userBusiness.update({
      where: {
        userId_businessId: {
          userId: userIdToUpdate,
          businessId: businessId,
        },
      },
      data: {
        businessRoleId: roleId,
      },
      include: {
        user: { select: { id: true, email: true, profile: true } },
        role: true,
      },
    });
    const message = this.i18n.translate("businesses.update_user_role.success");
    return {
      message,
      data: updatedUserBusiness,
    };
  }
}
