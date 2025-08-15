import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import {
  Prisma,
  Credit,
  CreditStatus,
  CreditTransactionType,
} from "@prisma/client";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../shared/services/audit.service";
import { GrantCreditDto } from "./dto/grant-credit.dto";
import { RedeemCreditDto } from "./dto/redeem-credit.dto";
import { FindCreditsDto } from "./dto/find-credits.dto";
@Injectable()
export class CreditsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly i18n: I18nService,
  ) {}
  private async getUserBusinessId(
    userId: string,
    businessId: string,
  ): Promise<string> {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: { userId, businessId },
      select: { id: true },
    });
    if (!userBusiness) {
      throw new ForbiddenException(
        "Authenticated user is not a member of this business.",
      );
    }
    return userBusiness.id;
  }
  async grant(
    dto: GrantCreditDto,
    businessId: string,
    createdByUserId: string,
  ): Promise<Credit> {
    const { customerId, amount, notes, expiresAt } = dto;
    if (amount <= 0) {
      throw new BadRequestException("Credit amount must be a positive number.");
    }
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${customerId}" not found in this business.`,
      );
    }
    const createdByUserBusinessId = await this.getUserBusinessId(
      createdByUserId,
      businessId,
    );
    return this.prisma.$transaction(async (tx) => {
      const credit = await tx.credit.create({
        data: {
          businessId,
          customerId,
          initialAmount: amount,
          balance: amount,
          status: CreditStatus.AVAILABLE,
          notes,
          expiresAt,
          createdBy: createdByUserBusinessId,
        },
      });
      // await tx.creditTransaction.create({
      //   data: {
      //     creditId: credit.id,
      //     amount,
      //     balanceBefore: 0,
      //     balanceAfter: amount,
      //     notes: 'Initial credit grant.',
      //     processedBy: createdByUserBusinessId,
      //   },
      // });
      // await this.auditService.logCreate('CREDIT', credit.id, createdByUserId, businessId, {
      //   ...dto,
      //   balance: amount,
      // });
      return credit;
    });
  }
  async redeem(
    dto: RedeemCreditDto,
    businessId: string,
    processedByUserId: string,
  ): Promise<Credit> {
    const { creditId, amount, notes, appointmentId, productSaleId } = dto;
    if (amount <= 0) {
      throw new BadRequestException("Redemption amount must be positive.");
    }
    const processedByUserBusinessId = await this.getUserBusinessId(
      processedByUserId,
      businessId,
    );
    return this.prisma.$transaction(async (tx) => {
      const credit = await tx.credit.findFirst({
        where: { id: creditId, businessId },
      });
      if (!credit) {
        throw new NotFoundException(
          this.i18n.translate("errors.credits.not_found"),
        );
      }
      if (credit.status !== CreditStatus.AVAILABLE) {
        throw new ForbiddenException(
          `Credit is not available. Status: ${credit.status}`,
        );
      }
      if (credit.balance < amount) {
        throw new BadRequestException(
          this.i18n.translate("errors.credits.insufficient_balance"),
        );
      }
      const newBalance = credit.balance - amount;
      const newStatus =
        newBalance === 0 ? CreditStatus.DEPLETED : CreditStatus.AVAILABLE;
      const updatedCredit = await tx.credit.update({
        where: { id: creditId },
        data: { balance: newBalance, status: newStatus },
      });
      // await tx.creditTransaction.create({
      //   data: {
      //     creditId: credit.id,
      //     amount: -amount,
      //     balanceBefore: credit.balance,
      //     balanceAfter: newBalance,
      //     notes,
      //     appointmentId,
      //     productSaleId,
      //     processedBy: processedByUserBusinessId,
      //   },
      // });
      // await this.auditService.logUpdate('CREDIT', credit.id, processedByUserId, businessId, {
      //   action: 'REDEEM',
      //   from: { balance: credit.balance },
      //   to: { balance: newBalance },
      // });
      return updatedCredit;
    });
  }
  async cancel(
    creditId: string,
    businessId: string,
    processedByUserId: string,
    notes?: string,
  ): Promise<Credit> {
    const processedByUserBusinessId = await this.getUserBusinessId(
      processedByUserId,
      businessId,
    );
    return this.prisma.$transaction(async (tx) => {
      const credit = await tx.credit.findFirst({
        where: { id: creditId, businessId },
      });
      if (!credit) {
        throw new NotFoundException(
          this.i18n.translate("errors.credits.not_found"),
        );
      }
      if (
        credit.status === CreditStatus.DEPLETED ||
        credit.status === CreditStatus.CANCELLED
      ) {
        throw new ForbiddenException(
          `Cannot cancel credit with status: ${credit.status}`,
        );
      }
      const balanceBefore = credit.balance;
      const updatedCredit = await tx.credit.update({
        where: { id: creditId },
        data: { balance: 0, status: CreditStatus.CANCELLED },
      });
      // await tx.creditTransaction.create({
      //   data: {
      //     creditId: credit.id,
      //     amount: -balanceBefore,
      //     balanceBefore,
      //     balanceAfter: 0,
      //     notes: notes || 'Credit cancelled by administrator.',
      //     processedBy: processedByUserBusinessId,
      //   },
      // });
      // await this.auditService.logUpdate('CREDIT', credit.id, processedByUserId, businessId, {
      //   action: 'CANCEL',
      //   from: { balance: balanceBefore },
      //   to: { balance: 0, status: 'CANCELLED' },
      // });
      return updatedCredit;
    });
  }
  async findAll(query: FindCreditsDto, businessId: string) {
    const { page = 1, limit = 10, customerId, status } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.CreditWhereInput = {
      businessId,
      ...(customerId && { customerId }),
      ...(status && { status }),
    };
    const [credits, total] = await this.prisma.$transaction([
      this.prisma.credit.findMany({
        where,
        include: {
          customer: { select: { id: true, displayName: true } },
          createdByUser: {
            select: {
              user: {
                select: {
                  profile: { select: { fullName: true } },
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.credit.count({ where }),
    ]);
    return {
      data: credits,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: string, businessId: string): Promise<Credit> {
    const credit = await this.prisma.credit.findFirst({
      where: { id, businessId },
      include: {
        customer: { select: { id: true, displayName: true, email: true } },
        createdByUser: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                profile: { select: { fullName: true } },
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: "asc" },
          include: {
            processedByUser: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    profile: { select: { fullName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!credit) {
      throw new NotFoundException(
        this.i18n.translate("errors.credits.not_found"),
      );
    }
    return credit;
  }
}
