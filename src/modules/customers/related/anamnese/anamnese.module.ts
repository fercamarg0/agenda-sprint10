import { Module } from "@nestjs/common";
import { AnamneseFormsService } from "./anamnese-forms.service";
import { AnamneseFormsController } from "./anamnese-forms.controller";
import { AnamneseRecordsService } from "./anamnese-records.service";
import { AnamneseRecordsController } from "./anamnese-records.controller";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { PaginationService } from "../../../../shared/services/pagination.service";
import { ApiConfigService } from "../../../../shared/services/api-config.service";
@Module({
  imports: [PrismaModule],
  controllers: [AnamneseFormsController, AnamneseRecordsController],
  providers: [
    AnamneseFormsService,
    AnamneseRecordsService,
    PaginationService,
    ApiConfigService,
  ],
})
export class AnamneseModule {}
