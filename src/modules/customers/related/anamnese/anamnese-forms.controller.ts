import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
import { AnamneseFormsService } from "./anamnese-forms.service";
import { CreateAnamneseFormDto } from "./dto/create-anamnese-form.dto";
import { UpdateAnamneseFormDto } from "./dto/update-anamnese-form.dto";
import { FindAnamneseFormsDto } from "./dto/find-anamnese-forms.dto";
import { Request } from "express";
@Controller("businesses/:businessId/anamnese-forms")
@UseGuards(AuthGuard("jwt"))
export class AnamneseFormsController {
  constructor(private readonly anamneseFormsService: AnamneseFormsService) {}
  @Post()
  create(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Body() createAnamneseFormDto: CreateAnamneseFormDto,
  ) {
    return this.anamneseFormsService.create(
      businessId,
      createAnamneseFormDto,
      req.user.sub,
    );
  }
  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Query() findAnamneseFormsDto: FindAnamneseFormsDto,
  ) {
    return this.anamneseFormsService.findAll(
      businessId,
      findAnamneseFormsDto,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.anamneseFormsService.findOne(businessId, id);
  }
  @Patch(":id")
  update(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateAnamneseFormDto: UpdateAnamneseFormDto,
  ) {
    return this.anamneseFormsService.update(
      businessId,
      id,
      updateAnamneseFormDto,
      req.user.sub,
    );
  }
  @Delete(":id")
  remove(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.anamneseFormsService.remove(businessId, id, req.user.sub);
  }
}
