import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: {
      user: AuthenticatedUser & { companyId: string };
      params: { companyId: string };
    } = context.switchToHttp().getRequest();
    const user = request.user;
    const companyId = request.params.companyId;
    return user && user.companyId === companyId;
  }
}
