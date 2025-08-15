import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaginationService } from "../../shared/services/pagination.service";
import { I18nService } from "nestjs-i18n";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateFinancialRecordDto } from "./dto/create-financial-record.dto";
import { UpdateFinancialRecordDto } from "./dto/update-financial-record.dto";
import { FindFinancialRecordsDto } from "./dto/find-financial-records.dto";
import { AuthenticatedUser } from "../../shared/helpers/interfaces/authenticated-user.interface";
import {
  FinancialRecordValidationHelper,
  FinancialRecordTransformationHelper,
  FinancialRecordQueryHelper,
} from "./helpers";
@Injectable()
export class FinancialRecordsService {
  private readonly logger = new Logger(FinancialRecordsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(
    dto: CreateFinancialRecordDto,
    user: AuthenticatedUser,
  ): Promise<{ data: any; message: string }> {
    try {
      FinancialRecordValidationHelper.validateBusinessId(user.businessId);
      FinancialRecordValidationHelper.validatePositiveAmount(dto.amount);
      await FinancialRecordValidationHelper.validateBusinessExists(
        this.prisma,
        user.businessId,
      );
      const recordDate = FinancialRecordValidationHelper.validateAndParseDate(
        dto.transactionDate,
      );
      if (dto.customerId) {
        await FinancialRecordValidationHelper.validateCustomer(
          this.prisma,
          dto.customerId,
          user.businessId,
        );
      }
      if (dto.appointmentId) {
        await FinancialRecordValidationHelper.validateAppointment(
          this.prisma,
          dto.appointmentId,
          user.businessId,
        );
      }
      const createData = FinancialRecordTransformationHelper.prepareCreateData(
        dto,
        user.businessId,
        recordDate,
      );
      const financialRecord = await this.prisma.financialRecord.create({
        data: createData,
        include: FinancialRecordQueryHelper.getStandardInclude(),
      });
      this.logger.log(
        `Created financial record with id: ${financialRecord.id}`,
      );
      return {
        data: FinancialRecordTransformationHelper.transformFinancialRecord(
          financialRecord,
        ),
        message: this.i18n.translate("messages.financial-records.created"),
      };
    } catch (error) {
      this.logger.error("Failed to create financial record:", error);
      throw error;
    }
  }
  async findAll(
    dto: FindFinancialRecordsDto,
    user: AuthenticatedUser,
    request?: any,
  ): Promise<{ data: any[]; meta: any; links?: any; message: string }> {
    const whereCondition = FinancialRecordQueryHelper.buildWhereCondition(
      dto,
      user.businessId,
    );
    const orderBy = FinancialRecordQueryHelper.buildOrderBy(dto);
    const paginatedRecords = await this.paginationService.paginate(
      "financialRecord",
      dto,
      {
        where: whereCondition,
        orderBy,
        include: FinancialRecordQueryHelper.getStandardInclude(),
      },
      FinancialRecordQueryHelper.getSearchableFields(),
      request,
    );
    const transformedData = paginatedRecords.data.map((record) =>
      FinancialRecordTransformationHelper.transformFinancialRecord(record),
    );
    return {
      data: transformedData,
      meta: paginatedRecords.meta,
      links: paginatedRecords.links,
      message: this.i18n.translate("messages.financial-records.found"),
    };
  }
  async findOne(
    id: string,
    user: AuthenticatedUser,
  ): Promise<{ data: any; message: string }> {
    const financialRecord = await this.prisma.financialRecord.findFirst({
      where: {
        id,
        businessId: user.businessId,
      },
      include: FinancialRecordQueryHelper.getStandardInclude(),
    });
    if (!financialRecord) {
      throw new NotFoundException(
        this.i18n.translate("messages.financial-records.not-found"),
      );
    }
    return {
      data: FinancialRecordTransformationHelper.transformFinancialRecord(
        financialRecord,
      ),
      message: this.i18n.translate("messages.financial-records.found"),
    };
  }
  async update(
    id: string,
    dto: UpdateFinancialRecordDto,
    user: AuthenticatedUser,
  ): Promise<{ data: any; message: string }> {
    try {
      await FinancialRecordValidationHelper.validateFinancialRecordExists(
        this.prisma,
        id,
        user.businessId,
      );
      if (dto.amount !== undefined) {
        FinancialRecordValidationHelper.validatePositiveAmount(dto.amount);
      }
      const recordDate = dto.transactionDate
        ? FinancialRecordValidationHelper.validateAndParseDate(
            dto.transactionDate,
          )
        : undefined;
      const updateData = FinancialRecordTransformationHelper.prepareUpdateData(
        dto,
        recordDate,
      );
      if (dto.customerId) {
        await FinancialRecordValidationHelper.validateCustomer(
          this.prisma,
          dto.customerId,
          user.businessId,
        );
      }
      if (dto.appointmentId) {
        await FinancialRecordValidationHelper.validateAppointment(
          this.prisma,
          dto.appointmentId,
          user.businessId,
        );
      }
      const updatedRecord = await this.prisma.financialRecord.update({
        where: { id },
        data: updateData,
        include: FinancialRecordQueryHelper.getStandardInclude(),
      });
      this.logger.log(
        `Updated financial record: ${id} for business: ${user.businessId}`,
      );
      return {
        data: FinancialRecordTransformationHelper.transformFinancialRecord(
          updatedRecord,
        ),
        message: this.i18n.translate("messages.financial-records.updated"),
      };
    } catch (error) {
      this.logger.error(`Failed to update financial record ${id}:`, error);
      throw error;
    }
  }
  async remove(
    id: string,
    user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const existingRecord = await this.prisma.financialRecord.findFirst({
      where: {
        id,
        businessId: user.businessId,
      },
    });
    if (!existingRecord) {
      throw new NotFoundException(
        this.i18n.t("messages.financial_record_not_found"),
      );
    }
    await this.prisma.financialRecord.delete({
      where: { id },
    });
    this.logger.log(
      `Deleted financial record: ${id} for business: ${user.businessId}`,
    );
    return {
      message: this.i18n.t("messages.financial_record_deleted_successfully"),
    };
  }
  async getFinancialSummary(
    user: AuthenticatedUser,
    startDate?: string,
    endDate?: string,
  ): Promise<{ data: any; message: string }> {
    const whereCondition =
      FinancialRecordQueryHelper.buildSummaryWhereCondition(
        user.businessId,
        startDate,
        endDate,
      );
    const [totalIncomes, totalExpenses, recordCount] = await Promise.all([
      this.prisma.financialRecord.aggregate({
        where: { ...whereCondition, type: "income" },
        _sum: { amount: true },
      }),
      this.prisma.financialRecord.aggregate({
        where: { ...whereCondition, type: "expense" },
        _sum: { amount: true },
      }),
      this.prisma.financialRecord.count({ where: whereCondition }),
    ]);
    const totalIncome = FinancialRecordTransformationHelper.fromDecimal(
      totalIncomes._sum.amount || new Decimal(0),
    );
    const totalExpense = FinancialRecordTransformationHelper.fromDecimal(
      totalExpenses._sum.amount || new Decimal(0),
    );
    return {
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        recordCount,
        averageIncome: recordCount > 0 ? totalIncome / recordCount : 0,
        averageExpense: recordCount > 0 ? totalExpense / recordCount : 0,
        period: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
      message: this.i18n.translate("messages.financial-records.summary"),
    };
  }
  async getRecordsByCategory(
    user: AuthenticatedUser,
    type?: string,
  ): Promise<{ data: any[]; message: string }> {
    const whereCondition: any = {
      businessId: user.businessId,
    };
    if (type && ["income", "expense"].includes(type)) {
      whereCondition.type = type;
    }
    const records = await this.prisma.financialRecord.findMany({
      where: whereCondition,
      select: {
        amount: true,
        type: true,
      },
    });
    const groupedData = records.reduce((acc: any, record) => {
      const recordType = record.type;
      acc[recordType] ??= {
        total: 0,
        count: 0,
        records: [],
      };
      acc[recordType].total += Number(record.amount);
      acc[recordType].count += 1;
      acc[recordType].records.push({
        amount: Number(record.amount),
      });
      return acc;
    }, {});
    return {
      data: groupedData,
      message: "Dados agrupados por categoria obtidos com sucesso",
    };
  }
}
