import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  Plan,
  Prisma,
  Subscription,
  SubscriptionProvider,
} from "@prisma/client";
import { VerifySubscriptionDto } from "./dto/verify-subscription.dto";
import { I18nService } from "nestjs-i18n";
@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async getAvailablePlans() {
    return this.prisma.plan.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        features: true,
      },
    });
  }
  async getSubscriptionStatus(
    businessId: string,
  ): Promise<(Subscription & { plan: Plan }) | null> {
    this.logger.log(
      `Verificando status da assinatura para o negocio: ${businessId}`,
    );
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        businessId: businessId,
        status: { in: ["ACTIVE", "TRIAL", "GRACE_PERIOD"] },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: true,
      },
    });
    if (!subscription) {
      this.logger.log(
        `Nenhuma assinatura ativa encontrada para o negocio: ${businessId}`,
      );
      return null;
    }
    this.logger.log(
      `Assinatura encontrada: ${subscription.id}, Status: ${subscription.status}`,
    );
    return subscription;
  }
  async verifyAndCreateSubscription(dto: VerifySubscriptionDto) {
    const { provider, providerSubscriptionId, planId, businessId } = dto;
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      throw new NotFoundException(
        this.i18n.translate("errors.subscriptions.plan_not_found"),
      );
    }
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);
    const newSubscription = await this.prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: {
          businessId,
          status: "ACTIVE",
        },
        data: {
          status: "CANCELED",
          canceledAt: now,
        },
      });
      return tx.subscription.create({
        data: {
          businessId,
          planId,
          provider,
          status: "ACTIVE",
          startDate: now,
          endDate: endDate,
          currentPeriodStart: now,
          currentPeriodEnd: endDate,
          providerSubscriptionId,
          events: {
            create: {
              data: dto as unknown as Prisma.InputJsonValue,
            },
          },
        },
        include: {
          plan: true,
        },
      });
    });
    return newSubscription;
  }
  async handleSubscriptionEvent(provider: SubscriptionProvider, payload: any) {
    this.logger.log(`Webhook recebido do provedor ${provider}`);
    switch (provider) {
      case "STRIPE":
        break;
      case "APPLE":
        break;
      case "GOOGLE":
        break;
      default:
        throw new BadRequestException("Provedor de webhook desconhecido.");
    }
    return { received: true };
  }
  async createFreeTrialForBusiness(businessId: string) {
    this.logger.log(`Iniciando criacao de trial para o negocio: ${businessId}`);
    const trialPlanName = "TRIAL";
    const trialDurationDays = 7;
    const trialPlan = await this.prisma.plan.upsert({
      where: { id: "plan_trial" },
      update: {},
      create: {
        id: "plan_trial",
        name: trialPlanName,
        version: 1,
        price: 0.0,
        currency: "BRL",
        active: true,
        features: ["TRIAL_ACCESS"],
      },
    });
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: { businessId },
    });
    if (existingSubscription) {
      this.logger.warn(
        `Negocio ${businessId} ja possui uma assinatura. O trial nao sera criado.`,
      );
      return existingSubscription;
    }
    const now = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(now.getDate() + trialDurationDays);
    this.logger.log(
      `Criando assinatura de trial para ${businessId} valida ate ${trialEndDate.toISOString()}`,
    );
    return this.prisma.subscription.create({
      data: {
        businessId,
        planId: trialPlan.id,
        provider: "SYSTEM",
        status: "TRIAL",
        startDate: now,
        endDate: trialEndDate,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndDate,
        events: {
          create: {},
        },
      },
    });
  }
}
