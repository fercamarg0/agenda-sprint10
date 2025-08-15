import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { AuthenticatedUser } from "../../../shared/helpers/interfaces/authenticated-user.interface";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET") ?? "",
    });
  }
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const { sub: userId, businessId, deviceId } = payload;
    if (!userId || !businessId) {
      this.logger.error("JWT payload is missing userId or businessId.");
      throw new UnauthorizedException();
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBusinesses: {
          where: { businessId: businessId },
          include: {
            role: true,
            business: true,
          },
        },
      },
    });
    if (!user) {
      this.logger.warn(
        `Unauthorized access attempt: User ${userId} not found.`,
      );
      throw new UnauthorizedException("Invalid credentials.");
    }
    if (user.tokensRevokedAt && payload.iat) {
      const tokenIssuedAt = new Date(payload.iat * 1000);
      if (tokenIssuedAt < user.tokensRevokedAt) {
        this.logger.warn(`Attempt to use a revoked token for user ${userId}.`);
        throw new UnauthorizedException("Token has been revoked.");
      }
    }
    const userBusiness = user.userBusinesses?.[0];
    if (!userBusiness || !userBusiness.role || !userBusiness.business) {
      this.logger.warn(
        `Unauthorized access attempt: User ${userId} has no valid role in business ${businessId}.`,
      );
      throw new UnauthorizedException("Invalid credentials or permissions.");
    }
    const { password, userBusinesses, ...userBase } = user;
    return {
      ...userBase,
      sub: userId,
      role: userBusiness.role,
      business: userBusiness.business,
      businessId: userBusiness.businessId,
      deviceId: deviceId,
    };
  }
}
