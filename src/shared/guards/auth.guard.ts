import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator/public.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { JwtPayload } from "@/modules/auth/interfaces/jwt-payload.interface";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedUser }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      });
      this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
      if (payload.sub && payload.businessId) {
        const user = await this.loadFullUserWithRole(
          payload.sub,
          payload.businessId,
        );
        if (user) {
          request.user = user;
          this.logger.debug(
            `Authenticated user: ${JSON.stringify({
              id: user.id,
              email: user.email,
              role: user.role?.name,
              businessId: user.business?.id,
            })}`,
          );
          return true;
        }
      }
      throw new UnauthorizedException("User not found or invalid context");
    } catch (error) {
      this.logger.error(
        `Authentication error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
  private async loadFullUserWithRole(
    userId: string,
    businessId: string,
  ): Promise<AuthenticatedUser | null> {
    const userSelect = {
      id: true,
      email: true,
      emailVerifiedAt: true,
      systemRole: true,
      tokensRevokedAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
    const userBusiness = await this.prisma.userBusiness.findUnique({
      where: {
        UserBusinessUnique: {
          userId: userId,
          businessId: businessId,
        },
      },
      include: {
        user: { select: userSelect },
        business: true,
        role: true,
      },
    });
    if (
      !userBusiness ||
      !userBusiness.user ||
      !userBusiness.business ||
      !userBusiness.role
    ) {
      this.logger.warn(
        `Could not find a valid UserBusiness record for user ${userId} and business ${businessId}`,
      );
      return null;
    }
    const authenticatedUser: AuthenticatedUser = {
      sub: userId,
      ...userBusiness.user,
      role: userBusiness.role,
      business: userBusiness.business,
      businessId: userBusiness.businessId,
    };
    return authenticatedUser;
  }
}
