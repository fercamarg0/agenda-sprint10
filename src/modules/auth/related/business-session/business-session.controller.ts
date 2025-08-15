import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BusinessSessionService } from "./business-session.service";
import { RequestWithUser } from "../../../../shared/interfaces/request-with-user.interface";
import { SetDefaultBusinessDto } from "./dto/set-default-business.dto";
import { OptionalParseUUIDPipe } from "../../../../shared/pipes/optional-parse-uuid.pipe";
import { SwitchBusinessDto } from "../../dto/switch-business.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("auth/businesses")
export class BusinessSessionController {
  constructor(
    private readonly businessSessionService: BusinessSessionService,
  ) {}

  @Patch("switch/:businessId")
  @HttpCode(HttpStatus.OK)
  async switchBusiness(
    @Req() req: RequestWithUser,
    @Param("businessId", OptionalParseUUIDPipe) targetBusinessId: string,
  ) {
    const userAgent = req.headers["user-agent"] ?? "";
    const switchDto: SwitchBusinessDto = { businessId: targetBusinessId };
    return this.businessSessionService.switchBusiness(
      req.user,
      userAgent,
      switchDto,
    );
  }

  @Post("set-default")
  @HttpCode(HttpStatus.OK)
  async setDefaultBusiness(
    @Req() req: RequestWithUser,
    @Body() setDefaultBusinessDto: SetDefaultBusinessDto,
  ) {
    return this.businessSessionService.setDefaultBusiness(
      req.user.sub,
      setDefaultBusinessDto.businessId,
    );
  }
}
