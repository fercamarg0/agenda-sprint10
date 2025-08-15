import { User as PrismaUser, BusinessRole, Business } from "@prisma/client";
export type SafeUser = Omit<PrismaUser, "password" | "refreshToken">;
export type AuthenticatedUser = SafeUser & {
  sub: string;
  role: BusinessRole;
  business: Business;
  businessId: string;
  deviceId?: string;
};
