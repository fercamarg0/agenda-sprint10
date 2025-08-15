import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "@/shared/interfaces/request-with-user.interface";
import { UserPreferencesService } from "./user-preferences.service";
import { UpdateUserPreferencesDto } from "./dto/update-user-preferences.dto";
@Controller("users/me/preferences")
@UseGuards(AuthGuard("jwt"))
export class UserPreferencesController {
  constructor(private readonly preferencesService: UserPreferencesService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPreferences(@Req() req: RequestWithUser) {
    return this.preferencesService.getPreferences(req.user.sub);
  }
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Req() req: RequestWithUser,
    @Body() updateUserPreferencesDto: UpdateUserPreferencesDto,
  ) {
    return this.preferencesService.updatePreferences(
      req.user.sub,
      updateUserPreferencesDto,
    );
  }
}
