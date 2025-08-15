import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { FinancialRecordsService } from "./financial-records.service";
import { CreateFinancialRecordDto } from "./dto/create-financial-record.dto";
import { UpdateFinancialRecordDto } from "./dto/update-financial-record.dto";
import { FindFinancialRecordsDto } from "./dto/find-financial-records.dto";
import { GetFinancialSummaryDto } from "./dto/get-financial-summary.dto";
import { Request } from "express";
@Controller("financial-records")
@UseGuards(AuthGuard("jwt"))
export class FinancialRecordsController {
  constructor(
    private readonly financialRecordsService: FinancialRecordsService,
  ) {}
  @Post()
  create(
    @Body() createDto: CreateFinancialRecordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.financialRecordsService.create(createDto, req.user);
  }
  @Get()
  //   status: 200,
  findAll(
    @Query() findDto: FindFinancialRecordsDto,
    @Req() req: RequestWithUser,
  ) {
    return this.financialRecordsService.findAll(
      findDto,
      req.user,
      req as unknown as Request,
    );
  }
  @Get("summary")
  getFinancialSummary(
    @Query() summaryDto: GetFinancialSummaryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.financialRecordsService.getFinancialSummary(
      req.user,
      summaryDto.startDate,
      summaryDto.endDate,
    );
  }
  @Get("by-category")
  getRecordsByCategory(
    @Req() req: RequestWithUser,
    @Query("type") type?: "INCOME" | "EXPENSE",
  ) {
    return this.financialRecordsService.getRecordsByCategory(req.user, type);
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.financialRecordsService.findOne(id, req.user);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateFinancialRecordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.financialRecordsService.update(id, updateDto, req.user);
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.financialRecordsService.remove(id, req.user);
  }
}
