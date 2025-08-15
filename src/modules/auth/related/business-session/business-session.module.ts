import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { TokenModule } from "../../shared/token/token.module";
import { BusinessSessionController } from "./business-session.controller";
import { BusinessSessionService } from "./business-session.service";
@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [BusinessSessionController],
  providers: [BusinessSessionService],
})
export class BusinessSessionModule {}
