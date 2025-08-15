import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { AuthModule } from "../../../auth/auth.module";
import { BusinessPageBioController } from "./page-bio.controller";
import { BusinessPageBioService } from "./page-bio.service";
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BusinessPageBioController],
  providers: [BusinessPageBioService],
})
export class BusinessPageBioModule {}
