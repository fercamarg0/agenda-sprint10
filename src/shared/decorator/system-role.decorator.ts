import { SetMetadata } from "@nestjs/common";
import { SystemRole } from "@prisma/client";
export const SYSTEM_ROLE_KEY = "system_role";
export const RequireSystemRole = (role: SystemRole) =>
  SetMetadata(SYSTEM_ROLE_KEY, role);
