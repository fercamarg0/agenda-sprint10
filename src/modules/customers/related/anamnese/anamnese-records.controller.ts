import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
import { AnamneseRecordsService } from "./anamnese-records.service";
import { CreateAnamneseRecordDto } from "./dto/create-anamnese-record.dto";
import { FindAnamneseRecordsDto } from "./dto/find-anamnese-records.dto";
import { SignAnamneseRecordDto } from "./dto/sign-anamnese-record.dto";
import { Request } from "express";
@Controller("businesses/:businessId/customers/:customerId/anamnese-records")
@UseGuards(AuthGuard("jwt"))
export class AnamneseRecordsController {
  constructor(
    private readonly anamneseRecordsService: AnamneseRecordsService,
  ) {}
  @Post()
  create(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("customerId", ParseUUIDPipe) customerId: string,
    @Body() createAnamneseRecordDto: CreateAnamneseRecordDto,
  ) {
    return this.anamneseRecordsService.create(
      businessId,
      customerId,
      createAnamneseRecordDto,
      req.user.sub,
    );
  }
  @Get()
  findAll(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("customerId", ParseUUIDPipe) customerId: string,
    @Query() findAnamneseRecordsDto: FindAnamneseRecordsDto,
    @Req() req: Request,
  ) {
    return this.anamneseRecordsService.findAll(
      businessId,
      customerId,
      findAnamneseRecordsDto,
      req,
    );
  }
  @Get(":id")
  findOne(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("customerId", ParseUUIDPipe) customerId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.anamneseRecordsService.findOne(businessId, customerId, id);
  }
  @Patch(":id/sign")
  sign(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("customerId", ParseUUIDPipe) customerId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() signAnamneseRecordDto: SignAnamneseRecordDto,
    @Req() req: Request,
  ) {
    return this.anamneseRecordsService.sign(
      businessId,
      customerId,
      id,
      signAnamneseRecordDto,
      req,
    );
  }
}
