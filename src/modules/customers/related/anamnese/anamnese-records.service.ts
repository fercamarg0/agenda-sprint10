import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationService } from "../../../../shared/services/pagination.service";
import { CreateAnamneseRecordDto } from "./dto/create-anamnese-record.dto";
import { SignAnamneseRecordDto } from "./dto/sign-anamnese-record.dto";
import { PaginationQueryDto } from "../../../../shared/dto/pagination";
import { I18nService } from "nestjs-i18n";
@Injectable()
export class AnamneseRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly i18n: I18nService,
  ) {}
  async create(
    businessId: string,
    customerId: string,
    dto: CreateAnamneseRecordDto,
    userId: string,
  ) {
    const userBusiness = await this.prisma.userBusiness.findFirst({
      where: { userId, businessId },
    });
    if (!userBusiness) {
      throw new BadRequestException(
        this.i18n.translate("errors.user.no_business_access"),
      );
    }
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId },
    });
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado");
    }
    const form = await this.prisma.anamneseForm.findFirst({
      where: { id: dto.anamneseFormId, businessId, deletedAt: null },
      include: { questions: { where: { deletedAt: null } } },
    });
    if (!form) {
      throw new NotFoundException(
        this.i18n.translate("errors.anamnese.form_not_found"),
      );
    }
    const requiredQuestions = form.questions.filter((q) => q.required);
    const answeredQuestionIds = dto.answersDetails.map(
      (a) => a.anamneseQuestionId,
    );
    for (const requiredQuestion of requiredQuestions) {
      if (!answeredQuestionIds.includes(requiredQuestion.id)) {
        throw new BadRequestException(
          `A pergunta obrigatória "${requiredQuestion.title}" deve ser respondida`,
        );
      }
    }
    const formQuestionIds = form.questions.map((q) => q.id);
    for (const answer of dto.answersDetails) {
      if (!formQuestionIds.includes(answer.anamneseQuestionId)) {
        throw new BadRequestException(
          "Uma ou mais perguntas não pertencem a este formulário",
        );
      }
    }
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.anamneseAnswer.create({
        data: {
          anamneseFormId: dto.anamneseFormId,
          businessId,
          customerId,
          filledById: userBusiness.id,
          date: new Date(),
          comments: dto.comments,
          createdById: userBusiness.id,
          updatedById: userBusiness.id,
        },
      });
      const answersDetailsData = dto.answersDetails.map((answer) => ({
        anamneseAnswerId: record.id,
        anamneseQuestionId: answer.anamneseQuestionId,
        booleanAnswer: answer.booleanAnswer,
        textAnswer: answer.textAnswer,
        anamneseQuestionItemIds: answer.anamneseQuestionItemIds ?? [],
        createdById: userBusiness.id,
        updatedById: userBusiness.id,
      }));
      await tx.anamneseAnswersDetail.createMany({ data: answersDetailsData });
      return tx.anamneseAnswer.findUnique({
        where: { id: record.id },
        include: {
          AnamneseForm: { select: { id: true, name: true } },
          answersDetails: {
            include: {
              AnamneseQuestion: { select: { id: true, title: true } },
            },
          },
          filledByProfessional: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  profile: {
                    select: {
                      fullName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
  }
  async findAll(
    businessId: string,
    customerId: string,
    query: PaginationQueryDto,
    req: Request,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId },
    });
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado");
    }
    if (query.orderBy === "createdAt") {
      query.orderBy = "date";
    }
    const findManyArgs = {
      where: {
        businessId,
        customerId,
      },
      include: {
        AnamneseForm: {
          select: {
            id: true,
            name: true,
          },
        },
        filledByProfessional: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    };
    return this.paginationService.paginate(
      "anamneseAnswer",
      query,
      findManyArgs,
      [],
      req,
    );
  }
  async findOne(businessId: string, customerId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId },
    });
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado");
    }
    const record = await this.prisma.anamneseAnswer.findFirst({
      where: { id, businessId, customerId },
      include: {
        AnamneseForm: {
          select: {
            id: true,
            name: true,
            terms: true,
          },
        },
        answersDetails: {
          include: {
            AnamneseQuestion: {
              select: {
                id: true,
                title: true,
                sectionTitle: true,
                questionType: true,
                section: true,
                questionItems: {
                  where: { deletedAt: null },
                  select: {
                    id: true,
                    label: true,
                  },
                },
              },
            },
          },
          orderBy: {
            AnamneseQuestion: {
              createdAt: "asc",
            },
          },
        },
        filledByProfessional: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!record) {
      throw new NotFoundException("Registro de anamnese não encontrado");
    }
    return record;
  }
  async sign(
    businessId: string,
    customerId: string,
    id: string,
    dto: SignAnamneseRecordDto,
    req: Request,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId },
    });
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado");
    }
    const record = await this.prisma.anamneseAnswer.findFirst({
      where: { id, businessId, customerId },
    });
    if (!record) {
      throw new NotFoundException("Registro de anamnese não encontrado");
    }
    if (record.signedAt) {
      throw new BadRequestException(
        "Este registro já foi assinado e não pode ser alterado",
      );
    }
    const userAgent = req.headers["user-agent"] ?? "Desconhecido";
    const ip = req.ip ?? req.connection.remoteAddress ?? "Desconhecido";
    const updatedRecord = await this.prisma.anamneseAnswer.update({
      where: { id },
      data: {
        signedAt: new Date(),
        signedDeviceInfo: userAgent,
        signedPlatform: req.headers.platform as string,
        signedDeviceModel: req.headers["device-model"] as string,
      },
    });
    await this.prisma.anamnesisSignature.create({
      data: {
        customerId,
        anamneseFormId: record.anamneseFormId,
        signatureData: {
          signature: dto.signature,
          ip,
          userAgent,
          timestamp: new Date().toISOString(),
        },
      },
    });
    return {
      message: "Anamnese assinada com sucesso",
      signedAt: updatedRecord.signedAt,
    };
  }
}
