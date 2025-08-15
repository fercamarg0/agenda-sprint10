import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PaginatedResponseDto, PaginationQueryDto } from "../dto/pagination";
import { ApiConfigService } from "./api-config.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Request } from "express";
export type PrismaModel = Exclude<keyof PrismaService, `$${string}` | symbol>;
interface PrismaDelegate {
  count(args?: any): Promise<number>;
  findMany(args?: any): Promise<any[]>;
}
@Injectable()
export class PaginationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiConfigService: ApiConfigService,
  ) {}
  async paginate<T>(
    model: PrismaModel,
    query: PaginationQueryDto,
    findManyArgs: Omit<
      Prisma.Args<(typeof this.prisma)[typeof model], "findMany">,
      "skip" | "take" | "orderBy"
    > = {},
    searchableFields: string[] = [],
    request?: Request,
  ): Promise<PaginatedResponseDto<T>> {
    findManyArgs.where = findManyArgs.where ?? {};
    if (query.search && searchableFields.length > 0) {
      const searchConditions = searchableFields.map((field) => {
        const parts = field.split(".");
        return parts.reduceRight((obj, part) => ({ [part]: obj }), {
          contains: query.search,
          mode: "insensitive",
        } as any);
      });
      findManyArgs.where = {
        ...findManyArgs.where,
        OR: searchConditions,
      };
    }
    const prismaModel = this.prisma[model] as PrismaDelegate;
    const totalItems = await prismaModel.count({ where: findManyArgs.where });
    const data = (await prismaModel.findMany({
      ...findManyArgs,
      skip: query.skip,
      take: query.limit,
      orderBy: {
        [query.orderBy]: query.orderDirection,
      },
    })) as T[];
    const path = request?.url.split("?")[0] ?? "";
    const baseUrl = this.apiConfigService.buildUrl(path, request);
    return PaginatedResponseDto.create<T>(
      data,
      totalItems,
      query.page,
      query.limit,
      baseUrl,
      request?.query ?? query,
    );
  }
}
