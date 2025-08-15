import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { AuditService } from "../../shared/services/audit.service";
import {
  Appointment,
  Prisma,
  Service,
  SystemRole,
  UserBusinessStatus,
} from "@prisma/client";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../shared/services/pagination.service";
import { FindEmployeesDto } from "./dto/find-employees.dto";
import { Request } from "express";
import { InviteEmployeeDto } from "./dto/invite-employee.dto";
import { SetCommissionDto } from "./dto/set-commission.dto";
import { FindCommissionsDto } from "./dto/find-commissions.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { RegisterCommissionPaymentDto } from "./dto/register-commission-payment.dto";
import { UpdateCommissionPaymentDto } from "./dto/update-commission-payment.dto";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}
  async invite(dto: InviteEmployeeDto, businessId: string) {
    const [role, business] = await Promise.all([
      this.prisma.businessRole.findUnique({ where: { id: dto.roleId } }),
      this.prisma.business.findUnique({ where: { id: businessId } }),
    ]);
    if (!role) {
      throw new NotFoundException(this.i18n.translate("errors.role.not_found"));
    }
    if (!business) {
      throw new NotFoundException(
        this.i18n.translate("errors.business.not_found"),
      );
    }
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const isNewUser = !user;
    if (!user) {
      const placeholderPassword = await bcrypt.hash(
        randomBytes(20).toString("hex"),
        10,
      );
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: placeholderPassword,
          systemRole: SystemRole.USER,
        },
      });
    }
    const existingUserBusiness = await this.prisma.userBusiness.findFirst({
      where: {
        userId: user.id,
        businessId: businessId,
      },
    });
    if (existingUserBusiness) {
      throw new BadRequestException(
        this.i18n.translate("errors.employee.already_exists_in_business"),
      );
    }
    await this.prisma.userBusiness.create({
      data: {
        userId: user.id,
        businessId: businessId,
        businessRoleId: dto.roleId,
        status: UserBusinessStatus.PENDING,
      },
    });
    if (isNewUser) {
      const invitationLink = `https://placeholder.com/invite`;
      // await this.notificationsService.sendInvitationEmail(
      //   dto.email,
      //   invitationLink,
      //   business.displayName,
      // );
    } else {
      // await this.notificationsService.sendBusinessAssociationEmail(
      //   user.email,
      //   business.displayName,
      //   "https://placeholder.com/associate",
      // );
    }
    return {
      message: this.i18n.translate("employees.invite_sent_success"),
    };
  }
  async create(
    dto: CreateEmployeeDto,
    businessIdFromAuth: string,
    roleIdForProfessional: string,
  ) {
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUserByEmail) {
      throw new BadRequestException(
        this.i18n.translate("errors.user.email_already_exists"),
      );
    }
    const hashedPasswordPlaceholder =
      "pnpm_generate_bcrypt_hash_for_this_later";
    const data: Prisma.UserCreateInput = {
      email: dto.email,
      password: hashedPasswordPlaceholder,
      profile: {
        create: {
          fullName: dto.name,
          phone: dto.phone,
        },
      },
    };
    const user = await this.prisma.user.create({ data });
    await this.prisma.userBusiness.create({
      data: {
        userId: user.id,
        businessId: businessIdFromAuth,
        businessRoleId: roleIdForProfessional,
      },
    });
    return {
      data: user,
      message: this.i18n.translate("users.create_professional.success"),
    };
  }
  async findAll(businessId: string, query: FindEmployeesDto, request: Request) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      userBusinesses: {
        some: { businessId: businessId },
      },
    };
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        {
          profile: {
            fullName: { contains: query.search, mode: "insensitive" },
          },
        },
      ];
    }
    return this.paginationService.paginate(
      "user",
      query,
      {
        where,
        include: {
          profile: true,
          userBusinesses: {
            where: { businessId },
            include: {
              role: true,
            },
          },
        },
      },
      [],
      request,
    );
  }
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.translate("errors.user.not_found"));
    }
    return {
      data: user,
      message: this.i18n.translate("users.find_one_professional.success"),
    };
  }
  async update(id: string, dto: UpdateEmployeeDto) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.translate("errors.user.not_found"));
    }
    const data: Prisma.UserUpdateInput = {
      email: dto.email,
      profile: {
        update: {
          fullName: dto.name,
          phone: dto.phone,
        },
      },
    };
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return {
      data: updatedUser,
      message: this.i18n.translate("users.update_professional.success"),
    };
  }
  async remove(id: string) {
    const employee = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!employee) {
      throw new NotFoundException(this.i18n.translate("errors.user.not_found"));
    }
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      message: this.i18n.translate("users.remove_professional.success"),
    };
  }
  async setCommission(
    userBusinessId: string,
    dto: SetCommissionDto,
    userId: string,
  ) {
    const userBusiness = await this.prisma.userBusiness.findUnique({
      where: { id: userBusinessId },
    });
    if (!userBusiness) {
      throw new NotFoundException(
        this.i18n.translate("errors.employee.not_found_in_business"),
      );
    }
    const existingCommission = await this.prisma.commission.findUnique({
      where: { userBusinessId },
    });
    if (existingCommission) {
      throw new BadRequestException(
        this.i18n.translate("errors.commission.already_exists"),
      );
    }
    const createdCommission = await this.prisma.commission.create({
      data: {
        userBusinessId: userBusinessId,
        percentage: dto.percentage,
      },
    });
    // await this.auditService.logCreate(
    //   "Commission",
    //   createdCommission.id,
    //   userId,
    //   userBusiness.businessId,
    //   { userBusinessId, percentage: dto.percentage },
    // );
    return {
      message: this.i18n.translate("commissions.create_success"),
    };
  }
  async updateCommission(
    commissionId: string,
    dto: SetCommissionDto,
    userId: string,
  ) {
    const commission = await this.prisma.commission.findUnique({
      where: { id: commissionId },
      include: { professional: true },
    });
    if (!commission) {
      throw new NotFoundException(
        this.i18n.translate("errors.commission.not_found"),
      );
    }
    const previousPercentage = commission.percentage;
    await this.prisma.commission.update({
      where: { id: commissionId },
      data: {
        percentage: dto.percentage,
      },
    });
    // await this.auditService.logUpdate(
    //   "Commission",
    //   commission.id,
    //   userId,
    //   commission.professional.businessId,
    //   {
    //     previousPercentage,
    //     newPercentage: dto.percentage,
    //     changes: dto,
    //   },
    // );
    return {
      message: this.i18n.translate("commissions.update_success"),
    };
  }
  async removeCommission(commissionId: string, userId: string) {
    const commission = await this.prisma.commission.findUnique({
      where: { id: commissionId },
      include: { professional: true },
    });
    if (!commission) {
      throw new NotFoundException(
        this.i18n.translate("errors.commission.not_found"),
      );
    }
    await this.prisma.commission.delete({
      where: { id: commissionId },
    });
    // await this.auditService.logDelete(
    //   "Commission",
    //   commission.id,
    //   userId,
    //   commission.professional.businessId,
    //   {
    //     deletedPercentage: commission.percentage,
    //     userBusinessId: commission.userBusinessId,
    //   },
    // );
    return {
      message: this.i18n.translate("commissions.delete_success"),
    };
  }
  async getCommission(userBusinessId: string) {
    const commission = await this.prisma.commission.findUnique({
      where: { userBusinessId },
    });
    if (!commission) {
      throw new NotFoundException(
        this.i18n.translate("errors.commission.not_found_for_professional"),
      );
    }
    return commission;
  }
  async listCommissionsOnSales(
    userBusinessId: string,
    query: FindCommissionsDto,
    request: Request,
  ) {
    const userBusiness = await this.prisma.userBusiness.findUnique({
      where: { id: userBusinessId },
    });
    if (!userBusiness) {
      throw new NotFoundException(
        this.i18n.translate("errors.employee.not_found_in_business"),
      );
    }
    const commission = await this.prisma.commission.findUnique({
      where: { userBusinessId },
    });
    if (!commission) {
      throw new BadRequestException(
        this.i18n.translate("errors.commission.not_set_for_professional"),
      );
    }
    type AppointmentWithService = Appointment & { service: Service | null };
    const paginatedAppointments =
      await this.paginationService.paginate<AppointmentWithService>(
        "appointment",
        query,
        {
          where: { userBusinessId },
          include: { service: true },
        },
        [],
        request,
      );
    const commissionPercentage = Number(commission.percentage);
    const dataWithCommission = paginatedAppointments.data.map((appt) => {
      const price = appt.service?.price ? Number(appt.service.price) : 0;
      return {
        ...appt,
        commission: (price * commissionPercentage) / 100,
      };
    });
    return {
      ...paginatedAppointments,
      data: dataWithCommission,
    };
  }
  async registerCommissionPayment(
    userBusinessId: string,
    dto: RegisterCommissionPaymentDto,
    userId: string,
  ) {
    const userBusiness = await this.prisma.userBusiness.findUnique({
      where: { id: userBusinessId },
    });
    if (!userBusiness) {
      throw new NotFoundException(
        this.i18n.translate("errors.employee.not_found_in_business"),
      );
    }
    const createdPayment = await this.prisma.commissionPayment.create({
      data: {
        userBusinessId,
        amount: dto.amount,
        notes: dto.notes,
        status: "PAID",
        paidAt: new Date(),
      },
    });
    // await this.auditService.logCreate(
    //   "CommissionPayment",
    //   createdPayment.id,
    //   userId,
    //   userBusiness.businessId,
    //   { ...dto, userBusinessId },
    // );
    return {
      message: this.i18n.translate("commissions.payment_registered_success"),
      data: createdPayment,
    };
  }
  async updateCommissionPayment(
    paymentId: string,
    dto: UpdateCommissionPaymentDto,
    userId: string,
  ) {
    const payment = await this.prisma.commissionPayment.findUnique({
      where: { id: paymentId },
      include: { professional: true },
    });
    if (!payment) {
      throw new NotFoundException(
        this.i18n.translate("errors.commission.payment_not_found"),
      );
    }
    const updatedPayment = await this.prisma.commissionPayment.update({
      where: { id: paymentId },
      data: dto,
    });
    // await this.auditService.logUpdate(
    //   "CommissionPayment",
    //   payment.id,
    //   userId,
    //   payment.professional.businessId,
    //   { changes: dto },
    // );
    return {
      message: this.i18n.translate("commissions.payment_updated_success"),
      data: updatedPayment,
    };
  }
  async deleteCommissionPayment(paymentId: string, userId: string) {
    const payment = await this.prisma.commissionPayment.findUnique({
      where: { id: paymentId },
      include: { professional: true },
    });
    if (!payment) {
      throw new NotFoundException(
        this.i18n.translate("errors.commission.payment_not_found"),
      );
    }
    await this.prisma.commissionPayment.delete({
      where: { id: paymentId },
    });
    // await this.auditService.logDelete(
    //   "CommissionPayment",
    //   payment.id,
    //   userId,
    //   payment.professional.businessId,
    //   { deletedRecord: { amount: payment.amount, notes: payment.notes } },
    // );
    return {
      message: this.i18n.translate("commissions.payment_deleted_success"),
    };
  }
}
