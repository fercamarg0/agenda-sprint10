import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly testmailApiKey: string;
  private readonly testmailNamespace: string;
  private readonly sourceEmail: string;
  private readonly isDevelopment: boolean;
  constructor(private readonly configService: ConfigService) {
    this.isDevelopment =
      this.configService.get<string>("NODE_ENV") !== "production";
    if (this.isDevelopment) {
      this.testmailApiKey =
        this.configService.get<string>("TESTMAIL_API_KEY") ??
        "f10940d5-3a76-4189-ae0b-9b5a37574b05";
      this.testmailNamespace =
        this.configService.get<string>("TESTMAIL_NAMESPACE") ?? "students";
      this.sourceEmail = "noreply@agendapower.com";
      this.logger.log(
        "NotificationsService initialized with TestMail.app for development",
      );
    } else {
      this.sourceEmail = this.configService.get<string>("SES_SOURCE_EMAIL")!;
      if (!this.sourceEmail) {
        this.logger.error("SES_SOURCE_EMAIL not configured for production.");
        throw new Error(
          "Email source address is not configured for production.",
        );
      }
    }
  }
  // private async sendEmail(
  //   to: string,
  //   subject: string,
  //   bodyHtml: string,
  // ): Promise<{ messageId: string }> {
  //   if (this.isDevelopment) {
  //     const testmailAddress = `${this.testmailNamespace}.agendapower@inbox.testmail.app`;
  //     this.logger.log(
  //       `[DEVELOPMENT] Simulating email send to ${to}. Subject: ${subject}`,
  //     );
  //     this.logger.log(
  //       `[DEVELOPMENT] Email would be sent to TestMail.app: ${testmailAddress}`,
  //     );
  //     this.logger.log(
  //       `[DEVELOPMENT] View emails at: https:
  //     );
  //     this.logger.log(
  //       `[DEVELOPMENT] Email body preview: ${bodyHtml.substring(0, 100)}...`,
  //     );
  //     try {
  //       const transporter = nodemailer.createTransport({
  //         host: 'smtp.testmail.app',
  //         port: 587,
  //         secure: false,
  //         auth: {
  //           user: this.testmailNamespace,
  //           pass: this.testmailApiKey,
  //         },
  //       });
  //       const info = await transporter.sendMail({
  //         from: this.sourceEmail,
  //         to: testmailAddress,
  //         subject: subject,
  //         html: bodyHtml,
  //       });
  //       this.logger.log(
  //         `[DEVELOPMENT] Email sent successfully to TestMail.app! Message ID: ${info.messageId}`,
  //       );
  //       this.logger.log(`[DEVELOPMENT] Original recipient: ${to}`);
  //       this.logger.log(`[DEVELOPMENT] TestMail address: ${testmailAddress}`);
  //       return { messageId: info.messageId };
  //     } catch (error) {
  //       this.logger.error(
  //         `[DEVELOPMENT] Failed to simulate email to ${to}`,
  //         error,
  //       );
  //       throw new Error('Failed to simulate email sending.');
  //     }
  //   } else {
  //     this.logger.error(
  //       'AWS SES not implemented yet. Please configure SES for production.',
  //     );
  //     throw new Error(
  //       'Production email sending not implemented. Please configure AWS SES.',
  //     );
  //   }
  //   async sendInvitationEmail(
  //     email: string,
  //     invitationLink: string,
  //     businessName: string,
  //   ) {
  //     this.logger.log(
  //       `[DEV] Mock invitation email sent to ${email} for business ${businessName}`,
  //     );
  //   }
  //   async sendBusinessAssociationEmail(
  //     email: string,
  //     businessName: string,
  //     link: string,
  //   ) {
  //     this.logger.log(
  //       `[DEV] Mock association email sent to ${email} for business ${businessName}`,
  //     );
  //   }
  // }
  async sendInvitationEmail(
    recipientEmail: string,
    invitationLink: string,
    businessName: string,
  ) {
    const subject = `Você foi convidado para se juntar à ${businessName}!`;
    const bodyHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
          <h1 style="color: #0d6efd; margin: 0;">AgendaPower</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Você foi convidado!</h2>
          <p>Olá,</p>
          <p>Você recebeu um convite para se juntar à equipe de <strong>${businessName}</strong> na plataforma AgendaPower.</p>
          <p>Para aceitar e criar sua conta, por favor, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="background-color: #0d6efd; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Aceitar Convite e Cadastrar</a>
          </div>
          <p>Se o botão não funcionar, você pode copiar e colar o seguinte link no seu navegador:</p>
          <p style="word-break: break-all; font-size: 12px;"><a href="${invitationLink}">${invitationLink}</a></p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">Se você não esperava este convite, pode ignorar este e-mail com segurança.</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #777;">
          <p style="margin: 0;">© ${new Date().getFullYear()} AgendaPower. Todos os direitos reservados.</p>
        </div>
      </div>
    `;
    // return this.sendEmail(recipientEmail, subject, bodyHtml);
  }
  async sendBusinessAssociationEmail(
    recipientEmail: string,
    businessName: string,
    loginLink: string,
  ) {
    const subject = `Você agora faz parte da ${businessName}!`;
    const bodyHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
          <h1 style="color: #0d6efd; margin: 0;">AgendaPower</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Bem-vindo(a) à ${businessName}!</h2>
          <p>Olá,</p>
          <p>Temos uma ótima notícia! Sua conta AgendaPower agora está associada à equipe de <strong>${businessName}</strong>.</p>
          <p>Você já pode acessar o ambiente do negócio fazendo login na sua conta através do botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginLink}" style="background-color: #0d6efd; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Acessar Minha Conta</a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">Se você acredita que esta associação foi um engano, por favor, entre em contato com o administrador de ${businessName}.</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #777;">
          <p style="margin: 0;">© ${new Date().getFullYear()} AgendaPower. Todos os direitos reservados.</p>
        </div>
      </div>
    `;
    // return this.sendEmail(recipientEmail, subject, bodyHtml);
  }
}
