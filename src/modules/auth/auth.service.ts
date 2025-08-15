import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./shared/token/token.service";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../../prisma/prisma.service";
import {
  BusinessRole,
  UserBusiness,
  UserBusinessStatus,
  EntityType,
} from "@prisma/client";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { hashPassword } from "../../shared/utils/hash-password.util";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { add } from "date-fns";
import { DeviceManagementService } from "./related/device-management/device-management.service";
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
    private readonly tokenService: TokenService,
    private readonly deviceManagementService: DeviceManagementService,
  ) {}
  async register(dto: RegisterDto) {
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
          status: UserBusinessStatus.ACCEPTED,
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
  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        preferences: true,
      },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException(
        this.i18n.translate("errors.auth.invalid_credentials"),
      );
    }
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        this.i18n.translate("auth.login.emailNotVerified"),
      );
    }
    const acceptedBusinesses = await this.prisma.userBusiness.findMany({
      where: {
        userId: user.id,
        status: UserBusinessStatus.ACCEPTED,
      },
      include: { role: true, business: true },
    });
    if (acceptedBusinesses.length === 0) {
      throw new UnauthorizedException(
        this.i18n.translate("auth.login.noBusinessAccounts"),
      );
    }
    let loginBusiness: (typeof acceptedBusinesses)[0] | undefined;
    if (user.preferences?.defaultBusinessId) {
      loginBusiness = acceptedBusinesses.find(
        (ub) => ub.businessId === user.preferences!.defaultBusinessId,
      );
    }
    if (!loginBusiness) {
      loginBusiness = acceptedBusinesses[0];
      if (user.preferences) {
        await this.prisma.userPreferences.update({
          where: { userId: user.id },
          data: { defaultBusinessId: loginBusiness.businessId },
        });
      } else {
        await this.prisma.userPreferences.create({
          data: {
            userId: user.id,
            defaultBusinessId: loginBusiness.businessId,
          },
        });
      }
    }
    const device = await this.prisma.userDevice.upsert({
      where: {
        userId_userAgent: {
          userId: user.id,
          userAgent,
        },
      },
      update: {
        lastUsedAt: new Date(),
        ipAddress,
      },
      create: {
        userId: user.id,
        ipAddress,
        userAgent,
      },
    });
    const { accessToken, refreshToken, accessTokenExpiresAt } =
      await this.tokenService.generateTokens({
        sub: user.id,
        email: user.email,
        businessId: loginBusiness.businessId,
        role: loginBusiness.role.name,
        systemRole: user.systemRole,
        deviceId: device.id,
      });
    await this.prisma.userDevice.update({
      where: { id: device.id },
      data: { refreshToken: refreshToken },
    });
    const { password, ...userResult } = user;
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      user: {
        ...userResult,
        currentBusiness: {
          id: loginBusiness.business.id,
          displayName: loginBusiness.business.displayName,
          email: loginBusiness.business.email,
          role: loginBusiness.role,
          isDefault:
            loginBusiness.businessId === user.preferences?.defaultBusinessId,
        },
      },
    };
  }
  async logout(userId: string, deviceId: string | undefined) {
    if (!deviceId) {
      throw new BadRequestException("Device ID is missing from the token.");
    }
    await this.deviceManagementService.revokeDevice(userId, deviceId);
  }
  async refreshToken(dto: RefreshTokenDto, userAgent: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(
        dto.refreshToken,
        {
          secret: this.configService.get<string>("jwt.refreshSecret"),
        },
      );
      const userDevice = await this.prisma.userDevice.findFirst({
        where: {
          userId: sub,
          userAgent: userAgent,
          refreshToken: dto.refreshToken,
        },
        include: {
          user: {
            include: {
              preferences: true,
              userBusinesses: {
                where: { status: UserBusinessStatus.ACCEPTED },
                include: { role: true },
              },
            },
          },
        },
      });
      if (!userDevice) {
        throw new UnauthorizedException("Invalid refresh token.");
      }
      const { user } = userDevice;
      if (!user.preferences?.defaultBusinessId) {
        throw new BadRequestException("Default business not set for user.");
      }
      const defaultBusiness:
        | (UserBusiness & { role: BusinessRole })
        | undefined = user.userBusinesses.find(
        (ub) => ub.businessId === user.preferences!.defaultBusinessId,
      );
      if (!defaultBusiness) {
        throw new BadRequestException(
          "Default business not found or access revoked.",
        );
      }
      const { accessToken, refreshToken, accessTokenExpiresAt } =
        await this.tokenService.generateTokens({
          sub: user.id,
          email: user.email,
          businessId: defaultBusiness.businessId,
          role: defaultBusiness.role.name,
          systemRole: user.systemRole,
        });
      await this.prisma.userDevice.update({
        where: { id: userDevice.id },
        data: { refreshToken: refreshToken, lastUsedAt: new Date() },
      });
      const { password, ...result } = user;
      return { accessToken, refreshToken, accessTokenExpiresAt, user: result };
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token.");
    }
  }
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.emailVerifiedAt) {
      console.log(
        `Password reset attempt for non-existent or unverified user: ${email}`,
      );
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = add(new Date(), { hours: 1 });
    await this.prisma.$transaction(async (tx) => {
      await tx.passwordReset.deleteMany({
        where: { userId: user.id },
      });
      await tx.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });
    });
    console.log(`Password reset token for ${email}: ${token}`);
  }
  async resetPassword(token: string, newPass: string): Promise<void> {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token },
    });
    if (!passwordReset || new Date() > passwordReset.expiresAt) {
      throw new BadRequestException(
        this.i18n.translate("errors.auth.invalid_or_expired_token"),
      );
    }
    const newHashedPassword = await hashPassword(newPass);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: passwordReset.userId },
        data: { password: newHashedPassword },
      }),
      this.prisma.passwordReset.delete({
        where: { id: passwordReset.id },
      }),
    ]);
  }
}
