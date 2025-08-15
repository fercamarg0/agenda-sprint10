import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SystemRole } from "@prisma/client";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { SYSTEM_ROLE_KEY } from "../decorator/system-role.decorator";
@Injectable()
export class SystemRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<SystemRole>(
      SYSTEM_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRole) {
      return true;
    }
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();
    if (!user || user.systemRole !== requiredRole) {
      throw new ForbiddenException(
        "You do not have the required system role to access this resource.",
      );
    }
    return true;
  }
}
