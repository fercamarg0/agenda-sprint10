import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { Public } from "../../../../shared/decorator/public.decorator";
import { EmailVerificationService } from "./email-verification.service";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { ResendVerificationEmailDto } from "./dto/resend-verification-email.dto";

@Controller("auth/email")
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly i18n: I18nService,
  ) {}

  @Post("verify")
  @Public()
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.emailVerificationService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );
    return {
      message: this.i18n.translate("messages.auth.email_verified"),
    };
  }

  @Post("resend-verification")
  @Public()
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(@Body() resendDto: ResendVerificationEmailDto) {
    await this.emailVerificationService.resendVerificationEmail(resendDto);
    return {
      message: this.i18n.translate("messages.auth.verification_email_sent"),
    };
  }
}
