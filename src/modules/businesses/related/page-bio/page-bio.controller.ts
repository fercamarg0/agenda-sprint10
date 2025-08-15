import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
import { BusinessPageBioService } from "./page-bio.service";
import { UpdateBusinessPageBioDto } from "./dto/update-business-page-bio.dto";
@Controller("businesses/:businessId/page-bio")
@UseGuards(AuthGuard("jwt"))
export class BusinessPageBioController {
  constructor(private readonly pageBioService: BusinessPageBioService) {}
  @Get()
  // summary: 'Obter Bio da Pagina do Negocio',
  //   'Retorna as informacoes publicas da pagina de um negocio, como links sociais e biografia.',
  getPageBio(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
  ) {
    return this.pageBioService.getPageBio(req.user.sub, businessId);
  }
  @Patch()
  // summary: 'Atualizar Bio da Pagina do Negocio',
  updatePageBio(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Body() updateDto: UpdateBusinessPageBioDto,
  ) {
    return this.pageBioService.updatePageBio(
      req.user.sub,
      businessId,
      updateDto,
    );
  }
}
