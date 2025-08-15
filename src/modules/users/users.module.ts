import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { SharedServicesModule } from "../../shared/services/shared-services.module";
import { UserPreferencesModule } from "./related/user-preferences/user-preferences.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PrismaModule,
    SharedServicesModule,
    UserPreferencesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
