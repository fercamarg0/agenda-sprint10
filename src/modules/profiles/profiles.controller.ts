import { Controller, Get, Body, Patch, UseGuards, Req } from "@nestjs/common";
import { ProfilesService } from "./profiles.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
@Controller("profiles")
@UseGuards(AuthGuard("jwt"))
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @Get("me")
  findMyProfile(@Req() req: RequestWithUser) {
    return this.profilesService.findByUserId(req.user.sub);
  }
  @Patch("me")
  updateMyProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateByUserId(req.user.sub, updateProfileDto);
  }
  @Get("me/referral-stats")
  getReferralStats(@Req() req: RequestWithUser) {
    return this.profilesService.getReferralStatsByUserId(req.user.sub);
  }
}
