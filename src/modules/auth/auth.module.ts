import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthService } from "./auth.service";

import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { TokenModule } from "./shared/token/token.module";
import { EmailVerificationModule } from "./related/email-verification/email-verification.module";
import { DeviceManagementModule } from "./related/device-management/device-management.module";
import { BusinessSessionModule } from "./related/business-session/business-session.module";

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({}),
    TokenModule,
    EmailVerificationModule,
    DeviceManagementModule,
    BusinessSessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
