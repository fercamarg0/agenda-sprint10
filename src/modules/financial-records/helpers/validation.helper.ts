import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
// import { AuthenticatedUser } from '../../../shared/interfaces/authenticated-user.interface';
export class FinancialRecordValidationHelper {
  static validateBusinessId(businessId?: string): void {
    if (!businessId) {
      throw new BadRequestException("Business ID é obrigatório");
    }
  }
  static validatePositiveAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException("Valor deve ser positivo");
    }
  }
  static async validateBusinessExists(
    prisma: PrismaService,
    businessId: string,
  ): Promise<void> {
    const business = await prisma.business.findFirst({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException("Business não encontrado");
    }
  }
  static validateAndParseDate(transactionDate?: string): Date {
    const recordDate = transactionDate ? new Date(transactionDate) : new Date();
    if (isNaN(recordDate.getTime())) {
      throw new BadRequestException("Data inválida");
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (recordDate > today) {
      throw new BadRequestException(
        "Não é possível criar registros com data futura",
      );
    }
    return recordDate;
  }
  static async validateCustomer(
    prisma: PrismaService,
    customerId: string,
    businessId: string,
  ): Promise<void> {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, businessId },
    });
    if (!customer) {
      throw new BadRequestException(
        "Cliente não encontrado ou não pertence ao seu negócio",
      );
    }
  }
  static async validateAppointment(
    prisma: PrismaService,
    appointmentId: string,
    businessId: string,
  ): Promise<void> {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, businessId },
    });
    if (!appointment) {
      throw new BadRequestException(
        "Agendamento não encontrado ou não pertence ao seu negócio",
      );
    }
  }
  static async validateFinancialRecordExists(
    prisma: PrismaService,
    id: string,
    businessId: string,
  ): Promise<void> {
    const record = await prisma.financialRecord.findFirst({
      where: { id, businessId },
    });
    if (!record) {
      throw new NotFoundException("Registro financeiro não encontrado");
    }
  }
}
