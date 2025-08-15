import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { UserBusinessStatus } from "@prisma/client";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import {
  RespondToInvitationDto,
  InvitationAction,
} from "./dto/respond-to-invitation.dto";
import { I18nService } from "nestjs-i18n";
import { AuthenticatedUser } from "../../../../shared/helpers/interfaces/authenticated-user.interface";
@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async inviteUser(
    businessId: string,
    inviteUserDto: CreateInvitationDto,
    currentUser: AuthenticatedUser,
  ) {
    const inviterMembership = await this.prisma.userBusiness.findFirst({
      where: { userId: currentUser.id, businessId },
      include: { role: true },
    });
    if (
      !inviterMembership ||
      !["OWNER", "ADMIN"].includes(inviterMembership.role.name)
    ) {
      throw new UnauthorizedException(
        "Voce nao tem permissao para convidar usuarios para este negocio.",
      );
    }
    const invitee = await this.prisma.user.findUnique({
      where: { email: inviteUserDto.email },
    });
    if (!invitee) {
      throw new NotFoundException(
        `Usuario com o email ${inviteUserDto.email} nao encontrado.`,
      );
    }
    if (invitee.id === currentUser.id) {
      throw new ConflictException("Voce nao pode convidar a si mesmo.");
    }
    const existingInvitation = await this.prisma.userBusiness.findFirst({
      where: { userId: invitee.id, businessId },
    });
    if (existingInvitation) {
      if (existingInvitation.status === UserBusinessStatus.PENDING) {
        throw new ConflictException(
          "Um convite ja esta pendente para este usuario.",
        );
      }
      if (existingInvitation.status === UserBusinessStatus.ACCEPTED) {
        throw new ConflictException("Este usuario ja e membro do negocio.");
      }
    }
    const invitation = await this.prisma.userBusiness.create({
      data: {
        userId: invitee.id,
        businessId: businessId,
        businessRoleId: inviteUserDto.roleId,
        status: UserBusinessStatus.PENDING,
      },
    });
    return {
      data: invitation,
      message: this.i18n.translate("messages.invitations.sent_successfully"),
    };
  }
  async getPendingInvitations(currentUser: AuthenticatedUser) {
    return this.prisma.userBusiness.findMany({
      where: {
        userId: currentUser.id,
        status: UserBusinessStatus.PENDING,
      },
      include: {
        business: {
          select: {
            id: true,
            displayName: true,
            logo: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async respondToInvitation(
    invitationId: string,
    respondDto: RespondToInvitationDto,
    currentUser: AuthenticatedUser,
  ) {
    const invitation = await this.prisma.userBusiness.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) {
      throw new NotFoundException("Convite nao encontrado.");
    }
    if (invitation.userId !== currentUser.id) {
      throw new ForbiddenException("Este convite nao pertence a voce.");
    }
    if (invitation.status !== UserBusinessStatus.PENDING) {
      throw new ConflictException(
        `Este convite ja foi ${invitation.status.toLowerCase()}.`,
      );
    }
    const newStatus =
      respondDto.action === InvitationAction.ACCEPT
        ? UserBusinessStatus.ACCEPTED
        : UserBusinessStatus.REJECTED;
    const updatedInvitation = await this.prisma.userBusiness.update({
      where: { id: invitationId },
      data: { status: newStatus },
    });
    return {
      data: updatedInvitation,
      message: this.i18n.translate(
        "messages.invitations.responded_successfully",
      ),
    };
  }
}
