import { Injectable, BadRequestException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ResendVerificationEmailDto } from "../../dto/resend-verification-email.dto";
@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { emailVerification: true },
    });
    if (
      !user ||
      !user.emailVerification ||
      user.emailVerification.token !== code
    ) {
      throw new BadRequestException(
        this.i18n.translate("errors.auth.invalid_verification_code"),
      );
    }
    if (new Date() > user.emailVerification.expiresAt) {
      throw new BadRequestException(
        this.i18n.translate("errors.auth.expired_verification_code"),
      );
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }),
      this.prisma.emailVerification.delete({
        where: { id: user.emailVerification.id },
      }),
    ]);
  }
  async resendVerificationEmail(dto: ResendVerificationEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      return {
        message: this.i18n.translate("auth.resend_verification.success"),
      };
    }
    if (user.emailVerifiedAt) {
      throw new BadRequestException(
        this.i18n.translate("errors.auth.email_already_verified"),
      );
    }
    const verificationToken = Math.floor(
      1000 + Math.random() * 9000,
    ).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await this.prisma.emailVerification.upsert({
      where: { userId: user.id },
      update: { token: verificationToken, expiresAt },
      create: { userId: user.id, token: verificationToken, expiresAt },
    });
    return {
      message: this.i18n.translate("auth.resend_verification.success"),
      verificationToken,
      verificationExpiresAt: expiresAt,
    };
  }
}
