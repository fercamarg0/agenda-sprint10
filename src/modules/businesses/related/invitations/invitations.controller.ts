import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Patch,
  ParseUUIDPipe,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InvitationsService } from "./invitations.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { RespondToInvitationDto } from "./dto/respond-to-invitation.dto";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
@Controller()
@UseGuards(AuthGuard("jwt"))
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}
  @Post("businesses/:businessId/invitations")
  // summary: 'Convidar usuario para um negocio',
  //   'Envia um convite para um usuario se juntar a um negocio com uma permissao especifica.',
  inviteUser(
    @Req() req: RequestWithUser,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    return this.invitationsService.inviteUser(
      businessId,
      createInvitationDto,
      req.user,
    );
  }
  @Get("invitations/pending")
  // summary: 'Listar convites pendentes',
  // status: 200,
  getPendingInvitations(@Req() req: RequestWithUser) {
    return this.invitationsService.getPendingInvitations(req.user);
  }
  @Patch("invitations/:invitationId/respond")
  // summary: 'Responder a um convite',
  // status: 200,
  respondToInvitation(
    @Req() req: RequestWithUser,
    @Param("invitationId", ParseUUIDPipe) invitationId: string,
    @Body() respondToInvitationDto: RespondToInvitationDto,
  ) {
    return this.invitationsService.respondToInvitation(
      invitationId,
      respondToInvitationDto,
      req.user,
    );
  }
}
