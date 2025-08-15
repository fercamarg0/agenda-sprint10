import { Decimal } from "@prisma/client/runtime/library";
export class FinancialRecordTransformationHelper {
  static toDecimal(amount: number | string): Decimal {
    return new Decimal(amount);
  }
  static fromDecimal(amount: Decimal | null | undefined): number {
    if (!amount) return 0;
    return parseFloat(amount.toString());
  }
  static formatDate(date: Date | string | null | undefined): string {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0];
  }
  static cleanString(str?: string): string | null {
    return str?.trim() || null;
  }
  static transformFinancialRecord(record: any): any {
    if (!record) return null;
    return {
      id: record.id,
      amount: this.fromDecimal(record.amount),
      transactionDate: this.formatDate(record.transactionDate),
      category: record.category,
      paymentMethod: record.paymentMethod,
      observations: record.observations,
      customer: record.customer || null,
      appointment: record.appointment || null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
  static prepareCreateData(
    dto: any,
    businessId: string,
    recordDate: Date,
  ): any {
    return {
      businessId,
      amount: this.toDecimal(dto.amount),
      transactionDate: recordDate,
      category: this.cleanString(dto.category),
      paymentMethod: dto.paymentMethod || null,
      observations: this.cleanString(dto.observations),
      customerId: dto.customerId || null,
      appointmentId: dto.appointmentId || null,
    };
  }
  static prepareUpdateData(dto: any, recordDate?: Date): any {
    const updateData: any = {};
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.amount !== undefined)
      updateData.amount = this.toDecimal(dto.amount);
    if (dto.description !== undefined)
      updateData.description = this.cleanString(dto.description);
    if (recordDate) updateData.transactionDate = recordDate;
    if (dto.category !== undefined)
      updateData.category = this.cleanString(dto.category);
    if (dto.paymentMethod !== undefined)
      updateData.paymentMethod = dto.paymentMethod;
    if (dto.observations !== undefined)
      updateData.observations = this.cleanString(dto.observations);
    if (dto.customerId !== undefined) updateData.customerId = dto.customerId;
    if (dto.appointmentId !== undefined)
      updateData.appointmentId = dto.appointmentId;
    return updateData;
  }
}
