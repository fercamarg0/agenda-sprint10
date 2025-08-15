import { IsEnum, IsNotEmpty } from "class-validator";
export enum InvitationAction {
  ACCEPT = "accept",
  REJECT = "reject",
}
export class RespondToInvitationDto {
  @IsEnum(InvitationAction)
  @IsNotEmpty()
  action: InvitationAction;
}
