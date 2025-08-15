import { Decimal } from "@prisma/client/runtime/library";
import { FindFinancialRecordsDto } from "../dto/find-financial-records.dto";
export class FinancialRecordQueryHelper {
  static getStandardInclude() {
    return {
      customer: {
        select: { id: true, displayName: true },
      },
      appointment: {
        select: { id: true, startTime: true },
      },
    };
  }
  static buildWhereCondition(dto: any, businessId: string): any {
    const whereCondition: any = {
      businessId,
    };
    if (dto.type && ["income", "expense"].includes(dto.type)) {
      whereCondition.type = dto.type;
    }
    if (dto.minAmount !== undefined) {
      whereCondition.amount = {
        ...whereCondition.amount,
        gte: new Decimal(dto.minAmount),
      };
    }
    if (dto.maxAmount !== undefined) {
      whereCondition.amount = {
        ...whereCondition.amount,
        lte: new Decimal(dto.maxAmount),
      };
    }
    if (dto.startDate) {
      whereCondition.transactionDate = {
        ...whereCondition.transactionDate,
        gte: new Date(dto.startDate),
      };
    }
    if (dto.endDate) {
      whereCondition.transactionDate = {
        ...whereCondition.transactionDate,
        lte: new Date(dto.endDate),
      };
    }
    if (dto.category) {
      whereCondition.category = {
        contains: dto.category,
        mode: "insensitive",
      };
    }
    const searchTerm = dto.description || dto.search;
    if (searchTerm) {
      whereCondition.description = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }
    return whereCondition;
  }
  static buildSummaryWhereCondition(
    businessId: string,
    startDate?: string,
    endDate?: string,
  ): any {
    const whereCondition: any = {
      businessId,
    };
    if (startDate) {
      whereCondition.transactionDate = {
        ...whereCondition.transactionDate,
        gte: new Date(startDate),
      };
    }
    if (endDate) {
      whereCondition.transactionDate = {
        ...whereCondition.transactionDate,
        lte: new Date(endDate),
      };
    }
    return whereCondition;
  }
  static buildOrderBy(dto: FindFinancialRecordsDto): any {
    const fieldMapping: Record<string, string> = {
      date: "transactionDate",
      amount: "amount",
      description: "description",
      createdAt: "createdAt",
    };
    const field = fieldMapping[dto.orderBy] || "createdAt";
    const direction = dto.orderDirection || "desc";
    return { [field]: direction };
  }
  static getSearchableFields(): string[] {
    return ["description"];
  }
}
