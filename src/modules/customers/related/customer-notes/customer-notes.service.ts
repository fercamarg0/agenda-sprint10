import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { I18nService } from "nestjs-i18n";
import { CreateCustomerNoteDto } from "./dto/create-customer-note.dto";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../../../../shared/dto/pagination";
import { CustomerNote } from "@prisma/client";
import { PaginationService } from "../../../../shared/services/pagination.service";
import { Request } from "express";
@Injectable()
export class CustomerNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateCustomerNoteDto) {
    const { businessId, customerId, description } = dto;
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        businessId,
        deletedAt: null,
      },
    });
    if (!customer) {
      throw new NotFoundException(
        this.i18n.translate("errors.customer.not_found"),
      );
    }
    const note = await this.prisma.customerNote.create({
      data: {
        customerId,
        description,
      },
      include: {
        customer: true,
      },
    });
    return note;
  }
  async findAll(
    customerId: string,
    businessId: string,
    query: PaginationQueryDto,
    request?: Request,
  ): Promise<PaginatedResponseDto<CustomerNote>> {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId, deletedAt: null },
    });
    if (!customer) {
      throw new NotFoundException(
        this.i18n.translate("errors.customer.not_found"),
      );
    }
    return this.paginationService.paginate<CustomerNote>(
      "customerNote",
      query,
      {
        where: {
          customerId,
          deletedAt: null,
        },
        include: {
          customer: {
            select: {
              displayName: true,
            },
          },
        },
      },
      ["description"],
      request,
    );
  }
  async findOne(id: string, businessId: string) {
    const note = await this.prisma.customerNote.findFirst({
      where: {
        id,
        deletedAt: null,
        customer: {
          businessId,
          deletedAt: null,
        },
      },
      include: {
        customer: true,
      },
    });
    if (!note) {
      throw new NotFoundException(
        this.i18n.translate("errors.customer_note.not_found"),
      );
    }
    return note;
  }
  async remove(id: string, businessId: string) {
    await this.findOne(id, businessId);
    await this.prisma.customerNote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      message: this.i18n.translate("messages.customer_note.deleted"),
    };
  }
}
