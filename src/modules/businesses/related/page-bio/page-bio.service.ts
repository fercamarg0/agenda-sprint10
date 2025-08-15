import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { UpdateBusinessPageBioDto } from "./dto/update-business-page-bio.dto";
import { BusinessPageBio } from "@prisma/client";
import { I18nService } from "nestjs-i18n";
@Injectable()
export class BusinessPageBioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  private async ensureUserHasAccessToBusiness(
    userId: string,
    businessId: string,
  ) {
    const userBusiness = await this.prisma.userBusiness.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });
    if (!userBusiness) {
      throw new ForbiddenException(
        this.i18n.translate("errors.business.no_access"),
      );
    }
  }
  private async generateSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    let slug = baseSlug;
    let count = 1;
    while (await this.prisma.businessPageBio.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }
    return slug;
  }
  async getPageBio(
    userId: string,
    businessId: string,
  ): Promise<BusinessPageBio> {
    await this.ensureUserHasAccessToBusiness(userId, businessId);
    const pageBio = await this.prisma.businessPageBio.findUnique({
      where: { businessId },
    });
    if (pageBio) {
      return pageBio;
    }
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException(
        this.i18n.translate("errors.business.not_found"),
      );
    }
    return this.prisma.businessPageBio.create({
      data: {
        businessId,
        name: business.displayName,
        slug: await this.generateSlug(business.displayName),
        locale: "pt-BR",
        onlineSchedulingAvailable: false,
      },
    });
  }
  async updatePageBio(
    userId: string,
    businessId: string,
    dto: UpdateBusinessPageBioDto,
  ): Promise<BusinessPageBio> {
    await this.ensureUserHasAccessToBusiness(userId, businessId);
    if (dto.onlineSchedulingSlug) {
      const existingSlugPage = await this.prisma.businessPageBio.findFirst({
        where: {
          onlineSchedulingSlug: dto.onlineSchedulingSlug,
          businessId: { not: businessId },
        },
      });
      if (existingSlugPage) {
        throw new ConflictException(
          this.i18n.translate("errors.page_bio.slug_in_use"),
        );
      }
    }
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException(
        this.i18n.translate("errors.business.not_found"),
      );
    }
    return this.prisma.businessPageBio.upsert({
      where: { businessId },
      update: {
        ...dto,
      },
      create: {
        businessId,
        name: dto.name ?? business.displayName,
        slug: await this.generateSlug(dto.name ?? business.displayName),
        locale: dto.locale ?? "pt-BR",
        onlineSchedulingAvailable: dto.onlineSchedulingAvailable ?? false,
        headerText: dto.headerText,
        avatarUrl: dto.avatarUrl,
        backgroundColorId: dto.backgroundColorId,
        borderColorId: dto.borderColorId,
        onlineSchedulingSlug: dto.onlineSchedulingSlug,
      },
    });
  }
}
