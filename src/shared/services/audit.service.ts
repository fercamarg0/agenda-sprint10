import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
export interface AuditLogData {
  businessId?: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
}
export interface SystemLogData {
  action: string;
  details?: string;
}
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}
  async logAudit(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          businessId: data.businessId,
          userId: data.userId,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          details: data.details ?? {},
        },
      });
    } catch (error: unknown) {
      console.error("Falha ao registrar audit log:", error);
      await this.logSystem({
        action: "AUDIT_LOG_FAILED",
        details: `Falha ao registrar audit log: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
  async logSystem(data: SystemLogData): Promise<void> {
    try {
      await this.prisma.systemLog.create({
        data: {
          action: data.action,
          details: data.details,
        },
      });
    } catch (error: unknown) {
      console.error("Falha crítica ao registrar system log:", error);
    }
  }
  async logCreate(
    entityType: string,
    entityId: string,
    userId: string,
    businessId?: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.logAudit({
      businessId,
      userId,
      action: "CREATE",
      entityType,
      entityId,
      details,
    });
  }
  async logUpdate(
    entityType: string,
    entityId: string,
    userId: string,
    businessId?: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.logAudit({
      businessId,
      userId,
      action: "UPDATE",
      entityType,
      entityId,
      details,
    });
  }
  async logDelete(
    entityType: string,
    entityId: string,
    userId: string,
    businessId?: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.logAudit({
      businessId,
      userId,
      action: "DELETE",
      entityType,
      entityId,
      details,
    });
  }
}
