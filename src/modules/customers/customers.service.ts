import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Customer } from "@prisma/client";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { I18nService } from "nestjs-i18n";
import { PaginationService } from "../../shared/services/pagination.service";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../../shared/dto/pagination";
import { Request } from "express";
@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const { businessId, addressId, address, ...rest } = dto;
    const customerData: Prisma.CustomerCreateInput = {
      ...rest,
      business: { connect: { id: businessId } },
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
    };
    if (addressId) {
      customerData.address = { connect: { id: addressId } };
    } else if (address) {
      customerData.address = { create: address };
    }
    return this.prisma.customer.create({
      data: customerData,
      include: { address: true, business: true },
    });
  }
  async findAll(
    businessId: string,
    query: PaginationQueryDto,
    request?: Request,
  ): Promise<PaginatedResponseDto<Customer>> {
    return this.paginationService.paginate<Customer>(
      "customer",
      query,
      {
        where: { businessId, deletedAt: null },
        include: { address: true },
      },
      ["displayName", "email", "phone", "cpf", "cnpj"],
      request,
    );
  }
  async findOne(id: string, businessId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, businessId, deletedAt: null },
      include: { address: true },
    });
    if (!customer) {
      const message = this.i18n.translate("errors.customer.not_found");
      throw new NotFoundException(message);
    }
    return customer;
  }
  async update(
    id: string,
    businessId: string,
    dto: UpdateCustomerDto,
  ): Promise<Customer> {
    const { addressId, address, ...rest } = dto;
    const existingCustomer = await this.prisma.customer.findFirst({
      where: { id, businessId, deletedAt: null },
      select: { addressId: true },
    });
    if (!existingCustomer) {
      const message = this.i18n.translate("errors.customer.not_found");
      throw new NotFoundException(message);
    }
    const customerData: Prisma.CustomerUpdateInput = { ...rest };
    if (dto.birthDate) {
      customerData.birthDate = new Date(dto.birthDate);
    }
    if (addressId === null) {
      customerData.address = { disconnect: true };
    } else if (addressId) {
      customerData.address = { connect: { id: addressId } };
    } else if (address) {
      if (existingCustomer.addressId) {
        customerData.address = { update: address };
      } else {
        const { street, number, neighborhood, city, state, zipCode } = address;
        if (
          street !== undefined &&
          number !== undefined &&
          neighborhood !== undefined &&
          city !== undefined &&
          state !== undefined &&
          zipCode !== undefined
        ) {
          customerData.address = {
            create: address as Prisma.AddressCreateWithoutCustomersInput,
          };
        }
      }
    }
    return this.prisma.customer.update({
      where: { id },
      data: customerData,
      include: { address: true, business: true },
    });
  }
  async remove(id: string, businessId: string) {
    const existingCustomer = await this.prisma.customer.findFirst({
      where: { id, businessId, deletedAt: null },
    });
    if (!existingCustomer) {
      const message = this.i18n.translate("errors.customer.not_found");
      throw new NotFoundException(message);
    }
    await this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    const message = this.i18n.translate("messages.customer.deleted");
    return { message };
  }
}
