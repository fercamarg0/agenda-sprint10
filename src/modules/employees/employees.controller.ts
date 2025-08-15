import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { EmployeesService } from "./employees.service";
import { InviteEmployeeDto } from "./dto/invite-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { FindEmployeesDto } from "./dto/find-employees.dto";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { SetCommissionDto } from "./dto/set-commission.dto";
import { RegisterCommissionPaymentDto } from "./dto/register-commission-payment.dto";
import { UpdateCommissionPaymentDto } from "./dto/update-commission-payment.dto";
import { FindCommissionsDto } from "./dto/find-commissions.dto";
@Controller("employees")
@UseGuards(AuthGuard("jwt"))
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  @Post("invite")
  invite(
    @Req() req: RequestWithUser,
    @Body() inviteEmployeeDto: InviteEmployeeDto,
  ) {
    return this.employeesService.invite(inviteEmployeeDto, req.user.businessId);
  }
  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query() findEmployeesDto: FindEmployeesDto,
  ) {
    return this.employeesService.findAll(
      req.user.businessId,
      findEmployeesDto,
      req as unknown as Request,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }
  @Post(":userBusinessId/commission")
  setCommission(
    @Req() req: RequestWithUser,
    @Param("userBusinessId", ParseUUIDPipe) userBusinessId: string,
    @Body() dto: SetCommissionDto,
  ) {
    return this.employeesService.setCommission(
      userBusinessId,
      dto,
      req.user.sub,
    );
  }
  @Patch("commission/:commissionId")
  updateCommission(
    @Req() req: RequestWithUser,
    @Param("commissionId", ParseUUIDPipe) commissionId: string,
    @Body() dto: SetCommissionDto,
  ) {
    return this.employeesService.updateCommission(
      commissionId,
      dto,
      req.user.sub,
    );
  }
  @Get(":userBusinessId/commission")
  getCommission(
    @Param("userBusinessId", ParseUUIDPipe) userBusinessId: string,
  ) {
    return this.employeesService.getCommission(userBusinessId);
  }
  @Get(":userBusinessId/commissions/sales")
  listCommissionsOnSales(
    @Req() req: RequestWithUser,
    @Param("userBusinessId", ParseUUIDPipe) userBusinessId: string,
    @Query() query: FindCommissionsDto,
  ) {
    return this.employeesService.listCommissionsOnSales(
      userBusinessId,
      query,
      req as unknown as Request,
    );
  }
  @Post(":userBusinessId/commissions/payments")
  registerCommissionPayment(
    @Req() req: RequestWithUser,
    @Param("userBusinessId", ParseUUIDPipe) userBusinessId: string,
    @Body() dto: RegisterCommissionPaymentDto,
  ) {
    return this.employeesService.registerCommissionPayment(
      userBusinessId,
      dto,
      req.user.sub,
    );
  }
  @Patch("commissions/payments/:paymentId")
  updateCommissionPayment(
    @Req() req: RequestWithUser,
    @Param("paymentId", ParseUUIDPipe) paymentId: string,
    @Body() dto: UpdateCommissionPaymentDto,
  ) {
    return this.employeesService.updateCommissionPayment(
      paymentId,
      dto,
      req.user.sub,
    );
  }
  @Delete("commissions/payments/:paymentId")
  deleteCommissionPayment(
    @Req() req: RequestWithUser,
    @Param("paymentId", ParseUUIDPipe) paymentId: string,
  ) {
    return this.employeesService.deleteCommissionPayment(
      paymentId,
      req.user.sub,
    );
  }
}
