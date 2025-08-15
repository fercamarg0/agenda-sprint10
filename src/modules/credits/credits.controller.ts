import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreditsService } from "./credits.service";
import { GrantCreditDto } from "./dto/grant-credit.dto";
import { RedeemCreditDto } from "./dto/redeem-credit.dto";
import { FindCreditsDto } from "./dto/find-credits.dto";
import { RequestWithUser } from "../../shared/helpers/interfaces/request-with-user.interface";
import { OptionalParseUUIDPipe } from "../../shared/pipes/optional-parse-uuid.pipe";
@Controller("credits")
@UseGuards(AuthGuard("jwt"))
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}
  @Post("grant")
  grant(@Body() grantCreditDto: GrantCreditDto, @Req() req: RequestWithUser) {
    const { businessId, sub: userId } = req.user;
    return this.creditsService.grant(grantCreditDto, businessId, userId);
  }
  @Post("redeem")
  redeem(
    @Body() redeemCreditDto: RedeemCreditDto,
    @Req() req: RequestWithUser,
  ) {
    const { businessId, sub: userId } = req.user;
    return this.creditsService.redeem(redeemCreditDto, businessId, userId);
  }
  @Patch(":id/cancel")
  cancel(
    @Param("id", OptionalParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const { businessId, sub: userId } = req.user;
    return this.creditsService.cancel(id, businessId, userId);
  }
  @Get()
  findAll(
    @Query() findCreditsDto: FindCreditsDto,
    @Req() req: RequestWithUser,
  ) {
    const { businessId } = req.user;
    return this.creditsService.findAll(findCreditsDto, businessId);
  }
  @Get(":id")
  findOne(
    @Param("id", OptionalParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const { businessId } = req.user;
    return this.creditsService.findOne(id, businessId);
  }
}
