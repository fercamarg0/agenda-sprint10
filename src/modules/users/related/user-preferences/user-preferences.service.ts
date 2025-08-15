import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../../../../prisma/prisma.service";
import { UpdateUserPreferencesDto } from "./dto/update-user-preferences.dto";
@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async getPreferences(userId: string) {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        language: true,
        currency: true,
        timezone: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!preferences) {
      return {
        userId,
        language: null,
        currency: null,
        timezone: null,
        theme: null,
      };
    }
    return preferences;
  }
  async updatePreferences(userId: string, dto: UpdateUserPreferencesDto) {
    const { language, currency, timezone, theme } = dto;
    const dataToUpdate: {
      language?: string;
      currency?: string;
      timezone?: string;
      theme?: string;
    } = {};
    if (dto.language !== undefined) {
      dataToUpdate.language = dto.language;
    }
    if (dto.currency !== undefined) {
      dataToUpdate.currency = dto.currency;
    }
    if (dto.timezone !== undefined) {
      dataToUpdate.timezone = dto.timezone;
    }
    if (dto.theme !== undefined) {
      dataToUpdate.theme = dto.theme;
    }
    const updatedPreferences = await this.prisma.userPreferences.upsert({
      where: { userId },
      update: dataToUpdate,
      create: {
        userId,
        language: dto.language,
        currency: dto.currency,
        timezone: dto.timezone,
        theme: dto.theme,
      },
      select: {
        id: true,
        userId: true,
        language: true,
        currency: true,
        timezone: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      message:
        (await this.i18n.t("users.preferences.updated_success")) ||
        "Preferências atualizadas com sucesso",
      data: updatedPreferences,
    };
  }
}
