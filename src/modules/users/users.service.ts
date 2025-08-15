import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma, EntityType, UserBusinessStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { hashPassword } from "../../shared/utils/hash-password.util";
import * as bcrypt from "bcryptjs";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../shared/services/pagination.service";
import { PaginationQueryDto } from "../../shared/dto/pagination";
import * as crypto from "crypto";
import { Request } from "express";
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        this.i18n.translate("errors.validation.users.already_exists"),
      );
    }
    return this.prisma.$transaction(async (tx) => {
      let referrerId: string | null = null;
      if (dto.referralCode) {
        const referrerProfile = await tx.profile.findUnique({
          where: { referralCode: dto.referralCode },
          select: { userId: true },
        });
        if (!referrerProfile) {
          throw new BadRequestException(
            this.i18n.translate(
              "errors.validation.users.invalid_referral_code",
            ),
          );
        }
        referrerId = referrerProfile.userId;
      }
      const hashedPassword = await hashPassword(dto.password);
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          profile: {
            create: {
              fullName: dto.name,
              phone: dto.phone,
              referralCode: crypto.randomBytes(4).toString("hex"),
            },
          },
        },
        include: {
          profile: true,
        },
      });
      const ownerRole = await tx.businessRole.findUnique({
        where: { name: "OWNER" },
      });
      if (!ownerRole) {
        throw new Error(
          "Default role OWNER not found. Please seed the database.",
        );
      }
      const newBusiness = await tx.business.create({
        data: {
          displayName: `Espaço de ${dto.name}`,
          email: dto.email,
          entityType: EntityType.PERSON,
        },
      });
      await tx.userBusiness.create({
        data: {
          userId: newUser.id,
          businessId: newBusiness.id,
          businessRoleId: ownerRole.id,
        },
      });
      if (referrerId) {
        await tx.referral.create({
          data: {
            referrerId: referrerId,
            referredId: newUser.id,
          },
        });
      }
      const verificationToken = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      await tx.emailVerification.create({
        data: {
          userId: newUser.id,
          token: verificationToken,
          expiresAt,
        },
      });
      const { password, ...result } = newUser;
      return {
        user: result,
        verificationToken,
        verificationExpiresAt: expiresAt,
      };
    });
  }
  async findAll(query: PaginationQueryDto, req?: Request) {
    return this.paginationService.paginate(
      "user",
      query,
      {
        where: { deletedAt: null },
        include: {
          userBusinesses: {
            include: {
              business: true,
              role: true,
            },
          },
        },
      },
      ["email", "profile.fullName"],
      req,
    );
  }
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        userBusinesses: {
          include: {
            business: true,
            role: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(
        this.i18n.translate("errors.validation.users.not_found"),
      );
    }
    return user;
  }
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(
        this.i18n.translate("errors.validation.users.not_found"),
      );
    }
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new BadRequestException(
          this.i18n.translate("errors.validation.users.email_already_exists"),
        );
      }
    }
    const data: Prisma.UserUpdateInput = {};
    if (dto.email) data.email = dto.email;
    if (dto.password) data.password = await hashPassword(dto.password);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      include: {
        userBusinesses: {
          include: {
            business: true,
            role: true,
          },
        },
      },
    });
    return updatedUser;
  }
  async findMe(userId: string, businessId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBusinesses: {
          where: {
            businessId: businessId,
            status: UserBusinessStatus.ACCEPTED,
          },
          include: {
            role: true,
            business: true,
          },
        },
        preferences: true,
        profile: {
          include: {
            address: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.translate("errors.user.not_found"));
    }
    const { password, ...result } = user;
    return result;
  }
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.translate("errors.user.not_found"));
    }
    const isPasswordMatch = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException(
        this.i18n.translate("errors.auth.invalid_credentials"),
      );
    }
    const newHashedPassword = await hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
  }
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(
        this.i18n.translate("errors.validation.users.not_found"),
      );
    }
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: this.i18n.translate("users.remove.success") };
  }
}
