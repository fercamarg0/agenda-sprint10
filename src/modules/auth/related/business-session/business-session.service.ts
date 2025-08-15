import { Injectable, ForbiddenException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { UserBusinessStatus } from "@prisma/client";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TokenService } from "../../shared/token/token.service";
import { AuthenticatedUser } from "../../../../shared/helpers/interfaces/authenticated-user.interface";
import { SwitchBusinessDto } from "../../dto/switch-business.dto";
import { EnumValidator } from "../../../../shared/helpers/enum.helper";
@Injectable()
export class BusinessSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly tokenService: TokenService,
  ) {}
  async setDefaultBusiness(userId: string, newDefaultBusinessId: string) {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: {
        userId: userId,
        businessId: newDefaultBusinessId,
        status: UserBusinessStatus.ACCEPTED,
      },
    });
    if (!userBusiness) {
      return;
    }
    const [business, role] = await Promise.all([
      this.prisma.business.findUnique({
        where: { id: newDefaultBusinessId },
        select: {
          id: true,
          displayName: true,
          deletedAt: true,
        },
      }),
      this.prisma.businessRole.findUnique({
        where: { id: userBusiness.businessRoleId },
        select: { name: true },
      }),
    ]);
    if (business?.deletedAt) {
      throw new ForbiddenException(
        this.i18n.translate("auth.setDefaultBusiness.businessDeleted"),
      );
    }
    const updatedPreferences = await this.prisma.userPreferences.upsert({
      where: { userId: userId },
      update: { defaultBusinessId: newDefaultBusinessId },
      create: { userId: userId, defaultBusinessId: newDefaultBusinessId },
    });
    return {
      message:
        this.i18n.translate("auth.business_session.default_updated_success") ||
        "Empresa padrão definida com sucesso",
      data: {
        defaultBusinessId: updatedPreferences.defaultBusinessId,
        businessName: business?.displayName || "Negócio",
        userRole: role?.name || "MEMBER",
      },
    };
  }
  async switchBusiness(
    authenticatedUser: AuthenticatedUser,
    userAgent: string,
    { businessId: newBusinessId }: SwitchBusinessDto,
  ) {
    const targetUserBusiness = await this.prisma.userBusiness.findUnique({
      where: {
        UserBusinessUnique: {
          userId: authenticatedUser.id,
          businessId: newBusinessId,
        },
      },
      include: { user: true, role: true },
    });
    if (
      !targetUserBusiness ||
      !EnumValidator.canUserAccessBusiness(targetUserBusiness.status)
    ) {
      throw new ForbiddenException(
        this.i18n.translate("auth.switchBusiness.notMember"),
      );
    }
    const { user, role } = targetUserBusiness;
    const { accessToken, refreshToken, accessTokenExpiresAt } =
      await this.tokenService.generateTokens({
        sub: user.id,
        email: user.email,
        businessId: newBusinessId,
        role: role.name,
        systemRole: user.systemRole,
      });
    await this.prisma.userDevice.upsert({
      where: {
        userId_userAgent: {
          userId: user.id,
          userAgent,
        },
      },
      update: {
        refreshToken: refreshToken,
        lastUsedAt: new Date(),
      },
      create: {
        userId: user.id,
        refreshToken: refreshToken,
        ipAddress: "unknown",
        userAgent,
      },
    });
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
    };
  }
}
