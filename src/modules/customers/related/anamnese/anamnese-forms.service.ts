import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationService } from "../../../../shared/services/pagination.service";
import { CreateAnamneseFormDto } from "./dto/create-anamnese-form.dto";
import { UpdateAnamneseFormDto } from "./dto/update-anamnese-form.dto";
import { PaginationQueryDto } from "../../../../shared/dto/pagination";
import { I18nService } from "nestjs-i18n";
@Injectable()
export class AnamneseFormsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly i18n: I18nService,
  ) {}
  async create(businessId: string, dto: CreateAnamneseFormDto, userId: string) {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: { userId, businessId },
      select: { id: true },
    });
    if (!userBusiness) {
      throw new BadRequestException(
        this.i18n.translate("errors.user.no_business_access"),
      );
    }
    return await this.prisma.anamneseForm.create({
      data: {
        businessId,
        name: dto.name,
        terms: dto.terms,
        createdById: userBusiness.id,
        updatedById: userBusiness.id,
        // questions: {
        //   create: dto.questions.map((question) => ({
        //     title: question.title,
        //     sectionTitle: question.sectionTitle,
        //     questionType: question.questionType,
        //     booleanWithDetails: question.booleanWithDetails,
        //     otherItemId: question.otherItemId,
        //     section: question.section,
        //     createdById: userBusiness.id,
        //     updatedById: userBusiness.id,
        //     questionItems: {
        //       create: question.questionItems.map((item) => ({
        //         text: item.text,
        //         createdById: userBusiness.id,
        //         updatedById: userBusiness.id,
        //       })),
        //     },
        //   })),
        // },
      },
      include: {
        questions: {
          include: {
            questionItems: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }
  async findAll(businessId: string, query: PaginationQueryDto, req: Request) {
    const whereClause = {
      businessId,
      deletedAt: null,
    };
    const findManyArgs = {
      where: whereClause,
    };
    return this.paginationService.paginate(
      "anamneseForm",
      query,
      findManyArgs,
      ["name", "description"],
      req,
    );
  }
  async findOne(businessId: string, id: string) {
    const form = await this.prisma.anamneseForm.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
      include: {
        questions: {
          where: { deletedAt: null },
          include: {
            questionItems: {
              where: { deletedAt: null },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!form) {
      throw new NotFoundException(
        this.i18n.translate("errors.anamnese.form_not_found"),
      );
    }
    return form;
  }
  async update(
    businessId: string,
    id: string,
    dto: UpdateAnamneseFormDto,
    userId: string,
  ) {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: {
        userId,
        businessId,
      },
    });
    if (!userBusiness) {
      throw new BadRequestException(
        this.i18n.translate("errors.user.no_business_access"),
      );
    }
    const form = await this.prisma.anamneseForm.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!form) {
      throw new NotFoundException(
        this.i18n.translate("errors.anamnese.form_not_found"),
      );
    }
    const hasAnswers = await this.prisma.anamneseAnswer.findFirst({
      where: {
        anamneseFormId: id,
      },
    });
    if (hasAnswers && (dto.name || dto.description)) {
      throw new BadRequestException(
        "Não é possível alterar um formulário que já foi utilizado para preenchimento",
      );
    }
    return await this.prisma.anamneseForm.update({
      where: { id },
      data: {
        name: dto.name,
        terms: dto.terms,
        updatedById: userBusiness.id,
      },
      include: {
        questions: {
          where: { deletedAt: null },
          include: {
            questionItems: {
              where: { deletedAt: null },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }
  async remove(businessId: string, id: string, userId: string) {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: {
        userId,
        businessId,
      },
    });
    if (!userBusiness) {
      throw new BadRequestException(
        this.i18n.translate("errors.user.no_business_access"),
      );
    }
    const form = await this.prisma.anamneseForm.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
    });
    if (!form) {
      throw new NotFoundException(
        this.i18n.translate("errors.anamnese.form_not_found"),
      );
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.anamneseQuestionItem.updateMany({
        where: {
          AnamneseQuestion: {
            anamneseFormId: id,
          },
        },
        data: {
          deletedAt: new Date(),
          deletedById: userBusiness.id,
        },
      });
      await tx.anamneseQuestion.updateMany({
        where: {
          anamneseFormId: id,
        },
        data: {
          deletedAt: new Date(),
          deletedById: userBusiness.id,
        },
      });
      await tx.anamneseForm.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedById: userBusiness.id,
        },
      });
    });
    return {
      message: this.i18n.translate("anamnese.form.deactivated_success"),
    };
  }
}
